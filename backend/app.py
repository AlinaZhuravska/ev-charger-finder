import sqlite3
import requests
from flask import Flask, jsonify, request
from api_utils import find_stations_in_bounds, create_db

app = Flask(__name__)

# Create DB and table if not exists
create_db()

# Connect to the SQLite database
def connect_db():
    return sqlite3.connect('db/stations.db')

# Endpoint to fetch stations visible in current map bounds or by center point
@app.route("/stations-nearby", methods=["GET"])
def stations_nearby():
    try:
        # Case 1: Bounds mode (used in MapPage)
        if all(param in request.args for param in ["north", "south", "east", "west"]):
            north = float(request.args.get("north"))
            south = float(request.args.get("south"))
            east = float(request.args.get("east"))
            west = float(request.args.get("west"))
            stations = find_stations_in_bounds(north, south, east, west)
            return jsonify(stations)

        # Case 2: Lat/Lon mode (used in StationPlanningPage)
        elif all(param in request.args for param in ["lat", "lon"]):
            lat = float(request.args.get("lat"))
            lon = float(request.args.get("lon"))
            delta = 0.05  # ~5km bounding box
            north = lat + delta
            south = lat - delta
            east = lon + delta
            west = lon - delta
            stations = find_stations_in_bounds(north, south, east, west)
            return jsonify(stations)

        else:
            return jsonify({"error": "Missing required parameters"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Proxy endpoint for geocoding using OpenStreetMap Nominatim
@app.route("/geocode", methods=["GET"])
def geocode():
    address = request.args.get("address")
    if not address:
        return jsonify({"error": "Missing address parameter"}), 400

    nominatim_url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "limit": 1,
    }
    headers = {
        "User-Agent": "ev-finder-app/1.0 (alizhuravska@gmail.com)"  
    }

    try:
        response = requests.get(nominatim_url, params=params, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
