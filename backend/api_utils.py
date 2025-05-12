import sqlite3
import requests
import os

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
        SELECT lat, lon, traffic_density, population_density, existing_stations, has_station
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

    return stations
