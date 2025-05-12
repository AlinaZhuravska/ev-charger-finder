import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
import os

# === Пример обучающих данных ===
# Формат: [traffic_density, population_density, existing_stations]
X = np.array([
    [100, 2000, 1],
    [150, 3000, 0],
    [80, 1500, 2],
    [120, 2500, 1],
    [200, 5000, 3]
])

# === Обучение скейлера ===
scaler = StandardScaler()
scaler.fit(X)

# === Сохранение в файл ===
scaler_path = os.path.join(os.path.dirname(__file__), "scaler.pkl")
joblib.dump(scaler, scaler_path)

print(f"Scaler saved to {scaler_path}")
