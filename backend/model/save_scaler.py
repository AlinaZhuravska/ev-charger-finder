import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
import os

# === Example training data ===
# Format: [traffic_density, population_density, existing_stations]
X = np.array([
    [100, 2000, 1],
    [150, 3000, 0],
    [80, 1500, 2],
    [120, 2500, 1],
    [200, 5000, 3]
])

# === Train the scaler ===
scaler = StandardScaler()
scaler.fit(X)

# === Save to file ===
scaler_path = os.path.join(os.path.dirname(__file__), "scaler.pkl")
joblib.dump(scaler, scaler_path)

print(f"Scaler saved to {scaler_path}")
