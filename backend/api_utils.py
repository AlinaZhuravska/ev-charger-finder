# backend/api_utils.py
import requests

API_KEY = "2a87c0ca-2e58-4fe3-886b-558b4826f7cd"

def find_nearby_stations(lat, lon, distance_km=10):
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

        stations = []
        for item in data:
            stations.append({
                "name": item.get("AddressInfo", {}).get("Title", "Unnamed Station"),
                "lat": item.get("AddressInfo", {}).get("Latitude"),
                "lon": item.get("AddressInfo", {}).get("Longitude"),
                "address": item.get("AddressInfo", {}).get("AddressLine1", "No address")
            })
        return stations
    except requests.RequestException as e:
        print(f"Error fetching stations: {e}")
        return []
