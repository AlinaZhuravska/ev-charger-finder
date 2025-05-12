import sqlite3
import requests
import os
import joblib
import numpy as np

API_KEY = "2a87c0ca-2e58-4fe3-886b-558b4826f7cd"
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'station_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'model', 'scaler.pkl')

# Функция для работы с базой данных
def connect_db():
    return sqlite3.connect('db/stations.db')

# Функция для создания базы данных и таблицы, если они не существуют
def create_db():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL,
            lon REAL,
            traffic_density INTEGER,
            population_density INTEGER,
            existing_stations INTEGER,
            has_station INTEGER,
            is_predicted INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

# Функция для добавления новой станции в базу данных
def insert_station(lat, lon, traffic_density, population_density, existing_stations, has_station, is_predicted=0):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO stations (lat, lon, traffic_density, population_density, existing_stations, has_station, is_predicted)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (lat, lon, traffic_density, population_density, existing_stations, has_station, is_predicted))
    conn.commit()
    conn.close()

# Функция для получения ближайших станций из базы данных или через OpenChargeMap API
def find_nearby_stations(lat, lon, distance_km=10):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM stations WHERE lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?',
                   (lat-0.1, lat+0.1, lon-0.1, lon+0.1))
    rows = cursor.fetchall()
    conn.close()

    stations = []
    for row in rows:
        stations.append({
            "lat": row[1],
            "lon": row[2],
            "traffic_density": row[3],
            "population_density": row[4],
            "existing_stations": row[5]
        })
    
    # Если станций не найдено в базе, получим через OpenChargeMap API
    if not stations:
        url = "https://api.openchargemap.io/v3/poi/"
        params = {
            "output": "json",
            "latitude": lat,
            "longitude": lon,
            "distance": distance_km,
            "distanceunit": "KM",
            "maxresults": 50,
            "key": API_KEY
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            for item in data:
                lat = item.get("AddressInfo", {}).get("Latitude")
                lon = item.get("AddressInfo", {}).get("Longitude")
                if lat and lon:
                    # Для реальных данных добавляем значения для трафика, плотности населения и существующих станций (в этом примере случайные значения)
                    traffic_density = 500  # Примерное значение для трафика
                    population_density = 2000  # Примерное значение для плотности населения
                    existing_stations = 3  # Примерное количество существующих станций
                    has_station = 1  # Считаем, что станция существует

                    # Добавляем данные в базу
                    insert_station(lat, lon, traffic_density, population_density, existing_stations, has_station)

                    stations.append({
                        "name": item.get("AddressInfo", {}).get("Title", "Unnamed Station"),
                        "lat": lat,
                        "lon": lon,
                        "address": item.get("AddressInfo", {}).get("AddressLine1", "No address")
                    })
        except requests.RequestException as e:
            print(f"Error fetching stations: {e}")
    
    return stations

# Функция для получения данных для обучения модели
def get_training_data():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT lat, lon, traffic_density, population_density, existing_stations, has_station FROM stations')
    rows = cursor.fetchall()
    conn.close()

    # Преобразуем строки в формат, подходящий для обучения
    data = []
    for row in rows:
        data.append({
            "traffic_density": row[2],
            "population_density": row[3],
            "existing_stations": row[4],
            "has_station": row[5]
        })
    return data
