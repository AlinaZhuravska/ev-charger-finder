import time
import random
import concurrent.futures
from api_utils import fetch_from_ocm, fetch_from_overpass, insert_station

LAT_START, LAT_END = 55.0, 56.0
LON_START, LON_END = 37.0, 38.0
STEP = 0.1  # ~10 km step

# Function to process a grid of coordinates and load data in parallel
def fetch_data_in_parallel(grid_points):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = executor.map(lambda point: (fetch_from_ocm(*point), fetch_from_overpass(*point)), grid_points)
        all_results = []
        for ocm_data, osm_data in results:
            all_results.extend(ocm_data)
            all_results.extend(osm_data)
        return all_results

def grid_loader():
    lat = LAT_START
    grid_points = []
    
    # Create grid points for the entire area to scan
    while lat < LAT_END:
        lon = LON_START
        while lon < LON_END:
            north = lat + STEP / 2
            south = lat - STEP / 2
            east = lon + STEP / 2
            west = lon - STEP / 2
            grid_points.append((north, south, east, west))  # Store the coordinates as a tuple
            lon += STEP
        lat += STEP

    # Fetch data from both OpenChargeMap and Overpass API in parallel
    all_station_data = fetch_data_in_parallel(grid_points)
    
    # Insert the fetched stations into the database
    for item in all_station_data:
        lat_ocm = item.get("AddressInfo", {}).get("Latitude")
        lon_ocm = item.get("AddressInfo", {}).get("Longitude")
        if lat_ocm and lon_ocm:
            insert_station(
                lat_ocm,
                lon_ocm,
                traffic_density=random.randint(200, 1000),
                population_density=random.randint(1000, 5000),
                existing_stations=random.randint(0, 5),
                has_station=1
            )

    time.sleep(1)  # Sleep to avoid overwhelming the API
