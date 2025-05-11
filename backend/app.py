from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
from api_utils import find_nearby_stations  # Util to get real charging stations from OpenChargeMap
from geopy.distance import geodesic         # For calculating distances

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Load trained model and scaler
model = joblib.load("station_model.pkl")
scaler = joblib.load("scaler.pkl")

# === Endpoint: Predict single location ===
@app.route("/predict-location", methods=["POST"])
def predict_location():
    data = request.get_json()
    try:
        # Extract input features from request
        traffic = data["traffic_density"]
        population = data["population_density"]
        existing = data["existing_stations"]

        # Format and scale features
        features = np.array([[traffic, population, existing]])
        scaled = scaler.transform(features)

        # Predict using the trained model
        prediction = model.predict(scaled)[0]
        return jsonify({"suitable": bool(prediction)})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# === Endpoint: Get real charging stations near a point ===
@app.route("/stations-nearby")
def stations_nearby():
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)

    if lat is None or lon is None:
        return jsonify({"error": "Missing lat or lon"}), 400

    try:
        # Use helper function to fetch stations from OpenChargeMap API
        stations = find_nearby_stations(lat, lon)
        return jsonify(stations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === Endpoint: Predict suitable charging station locations in a given area ===
@app.route("/predict-area", methods=["POST"])
def predict_area():
    data = request.get_json()

    try:
        bounds = data["bounds"]

        # Simulated input features (can later be derived from real data)
        traffic_density = data.get("traffic_density", 100)
        population_density = data.get("population_density", 1000)
        radius_km = 2.0  # Minimum distance to existing station to avoid overcrowding

        # Get all real stations in the bounding box to use for proximity checks
        center_lat = (bounds["north"] + bounds["south"]) / 2
        center_lon = (bounds["east"] + bounds["west"]) / 2
        real_stations = find_nearby_stations(center_lat, center_lon, distance_km=30)

        predicted_stations = []

        # Iterate through grid in the bounding box
        for lat in np.arange(bounds["south"], bounds["north"], 0.01):
            for lon in np.arange(bounds["west"], bounds["east"], 0.01):
                # Count existing stations within radius_km of current point
                nearby_count = sum(
                    geodesic((lat, lon), (s["lat"], s["lon"])).km <= radius_km
                    for s in real_stations
                )

                # Skip this point if too many stations are nearby
                if nearby_count >= 1:
                    continue

                # Format input features and scale them
                features = np.array([[traffic_density, population_density, nearby_count]])
                scaled = scaler.transform(features)

                # Use model to predict suitability
                prediction = model.predict(scaled)[0]
                if prediction:
                    predicted_stations.append({"lat": lat, "lon": lon})

        return jsonify({"stations": predicted_stations})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# === Main entry point ===
if __name__ == "__main__":
    app.run(debug=True)
