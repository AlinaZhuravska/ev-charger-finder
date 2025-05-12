import sqlite3
import random

DB_PATH = "db/stations.db"

def populate_dummy_data(num_rows=100):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for _ in range(num_rows):
        lat = round(random.uniform(46.5, 47.5), 6)  # координаты в пределах Швейцарии
        lon = round(random.uniform(6.5, 8.5), 6)
        traffic_density = random.randint(50, 300)
        population_density = random.randint(100, 500)
        existing_stations = random.randint(0, 5)

        cursor.execute("""
            INSERT INTO stations (lat, lon, traffic_density, population_density, existing_stations)
            VALUES (?, ?, ?, ?, ?)
        """, (lat, lon, traffic_density, population_density, existing_stations))

    conn.commit()
    conn.close()
    print(f"✅ Inserted {num_rows} rows into 'stations' table.")

if __name__ == "__main__":
    populate_dummy_data()
