import sqlite3
import requests
import os
import random
import pandas as pd  # Added for creating DataFrame

from sklearn.linear_model import LogisticRegression
import joblib

# === Load ML model and scaler ===
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "model", "scaler.pkl")

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error when loading the model: {e}")
    model = None

try:
    scaler = joblib.load(SCALER_PATH)
except Exception as e:
    print(f"Error when loading the scaler: {e}")
    scaler = None

if model is None or scaler is None:
    print("The model or scaler is not loaded. Check if the files are available and try again.")
    # Additional option to raise an exception or terminate the program
    # raise RuntimeError("Model or scaler not loaded.")

def get_training_data():
    """
    Loads data from the database for model training.
    It is expected that the 'stations' table contains the following fields:
    - traffic_density (REAL)
    - population_density (REAL)
    - existing_stations (INTEGER)
    - has_station (INTEGER: 0 or 1)
    """
    conn = sqlite3.connect("db/stations.db")
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT traffic_density, population_density, existing_stations, has_station
            FROM stations
            WHERE traffic_density IS NOT NULL
              AND population_density IS NOT NULL
              AND existing_stations IS NOT NULL
              AND has_station IS NOT NULL
        """)
        data = cursor.fetchall()
        return data
    finally:
        conn.close()

# OpenChargeMap API key
API_KEY = "2a87c0ca-2e58-4fe3-886b-558b4826f7cd"

# Connect to the local SQLite database
def connect_db():
    return sqlite3.connect('db/stations.db')

# Create the stations table if it doesn't exist
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

# Insert a station into the local database
def insert_station(lat, lon, traffic_density, population_density, existing_stations, has_station, is_predicted=0):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO stations (lat, lon, traffic_density, population_density, existing_stations, has_station, is_predicted)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (lat, lon, traffic_density, population_density, existing_stations, has_station, is_predicted))
    conn.commit()
    conn.close()

# Fetch stations from OpenChargeMap with pagination support
def fetch_from_ocm(north, south, east, west):
    all_data = []
    page = 1
    while True:
        params = {
            "output": "json",
            "boundingbox": f"{north},{south},{east},{west}",
            "distanceunit": "KM",
            "maxresults": 50,  # You can adjust this as needed
            "page": page,  # Pagination parameter
            "key": API_KEY
        }
        try:
            response = requests.get("https://api.openchargemap.io/v3/poi/", params=params)
            data = response.json()
            if not data:  # Stop loop if no data is returned
                break
            all_data.extend(data)
            page += 1  # Go to the next page
        except Exception as e:
            print(f"[OCM Error] {e}")
            break
    return all_data

# Fetch stations from Overpass API
def fetch_from_overpass(north, south, east, west):
    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="charging_station"]({south},{west},{north},{east});
      way["amenity"="charging_station"]({south},{west},{north},{east});
      relation["amenity"="charging_station"]({south},{west},{north},{east});
    );
    out body;  // This gives more detailed results
    """
    try:
        response = requests.post("https://overpass-api.de/api/interpreter", data={"data": query})
        return response.json().get("elements", [])
    except Exception as e:
        print(f"[Overpass Error] {e}")
        return []

# Find stations within the specified bounding box
def find_stations_in_bounds(north, south, east, west):
    conn = connect_db()
    cursor = conn.cursor()

    # Select stations within the bounds from the local database
    cursor.execute('''
        SELECT lat, lon, traffic_density, population_density, existing_stations, has_station, is_predicted
        FROM stations
        WHERE lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?
    ''', (south, north, west, east))
    rows = cursor.fetchall()
    conn.close()

    stations = []
    for row in rows:
        stations.append({
            "lat": row[0],
            "lon": row[1],
            "traffic_density": row[2],
            "population_density": row[3],
            "existing_stations": row[4],
            "has_station": row[5],
            "is_predicted": row[6],
            "name": f"Station ({row[0]:.4f}, {row[1]:.4f})",
            "address": "Unknown"
        })

    # If no stations found in the local DB, fetch from OpenChargeMap and add them to the DB
    if not stations:
        # Fetch from OpenChargeMap if no local stations
        ocm_data = fetch_from_ocm(north, south, east, west)
        for item in ocm_data:
            lat = item.get("AddressInfo", {}).get("Latitude")
            lon = item.get("AddressInfo", {}).get("Longitude")
            if lat and lon:
                traffic_density = 500  # Placeholder value
                population_density = 2000  # Placeholder value
                existing_stations = 3  # Placeholder value
                has_station = 1  # Since it's from OpenChargeMap

                insert_station(lat, lon, traffic_density, population_density, existing_stations, has_station)

                stations.append({
                    "lat": lat,
                    "lon": lon,
                    "traffic_density": traffic_density,
                    "population_density": population_density,
                    "existing_stations": existing_stations,
                    "has_station": has_station,
                    "name": item.get("AddressInfo", {}).get("Title", "Unnamed Station"),
                    "address": item.get("AddressInfo", {}).get("AddressLine1", "No address")
                })

    # If still no stations found, fetch from Overpass API and add them to the DB
    if not stations:
        osm_data = fetch_from_overpass(north, south, east, west)
        for obj in osm_data:
            lat = obj.get("lat") or obj.get("center", {}).get("lat")
            lon = obj.get("lon") or obj.get("center", {}).get("lon")
            if lat and lon:
                traffic_density = 500  # Placeholder value
                population_density = 2000  # Placeholder value
                existing_stations = 3  # Placeholder value
                has_station = 1  # Since it's from Overpass API

                insert_station(lat, lon, traffic_density, population_density, existing_stations, has_station)

                stations.append({
                    "lat": lat,
                    "lon": lon,
                    "traffic_density": traffic_density,
                    "population_density": population_density,
                    "existing_stations": existing_stations,
                    "has_station": has_station,
                    "name": "Unnamed Station",
                    "address": "No address"
                })

    # Predict if a station should be added based on the ML model
    if not stations:
        # Generate random coordinates within the bounding box
        for _ in range(10):  # Generate 10 random points
            lat = random.uniform(south, north)
            lon = random.uniform(west, east)
            traffic_density = random.randint(50, 300)
            population_density = random.randint(100, 500)
            existing_stations = random.randint(0, 5)

            X_input = [[traffic_density, population_density, existing_stations]]
            X_scaled = scaler.transform(X_input)
            has_station_pred = int(model.predict(X_scaled)[0])

            if has_station_pred == 1:
                insert_station(
                    lat, lon,
                    traffic_density,
                    population_density,
                    existing_stations,
                    has_station_pred,
                    is_predicted=1
                )

            stations.append({
                "lat": lat, # Latitude of the station — value of the variable lat
                "lon": lon, # Longitude of the station — value of the variable lon
                "traffic_density": traffic_density, # Traffic density at this location
                "population_density": population_density,  # Population density in this area
                "existing_stations": existing_stations, # Number of existing stations nearby
                "has_station": has_station_pred, # Model prediction: should there be a station here (boolean or number)
                "is_predicted": 1, # Flag indicating that this is a model-predicted station
                "name": "Predicted Station", # Name of the station (default, since it's predicted)
                "address": "Predicted by model"  # Address (not exact, since generated by the model)
            })
    return stations

