import sqlite3
from flask import Flask, jsonify, request
from api_utils import find_nearby_stations

app = Flask(__name__)

# Функция для работы с базой данных
def connect_db():
    return sqlite3.connect('db/stations.db')

@app.route("/stations-nearby", methods=["GET"])
def stations_nearby():
    lat = float(request.args.get("lat"))
    lon = float(request.args.get("lon"))
    stations = find_nearby_stations(lat, lon)
    return jsonify(stations)

if __name__ == "__main__":
    app.run(debug=True)
