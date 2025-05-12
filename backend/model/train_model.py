import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os
from api_utils import get_training_data

# Получаем данные из базы данных
data = get_training_data()

# Преобразуем в DataFrame
columns = ["traffic_density", "population_density", "existing_stations", "has_station"]
df = pd.DataFrame(data, columns=columns)

# Проверим структуру данных, чтобы убедиться, что они корректны
print("Пример данных из базы:")
print(df.head())

# Разделяем данные на признаки (X) и целевую переменную (y)
X = df[["traffic_density", "population_density", "existing_stations"]]
y = df["has_station"]

# Масштабируем признаки
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Обучаем модель логистической регрессии
model = LogisticRegression()
model.fit(X_scaled, y)

# Сохраняем модель и скейлер
model_dir = os.path.join(os.path.dirname(__file__), 'model')
os.makedirs(model_dir, exist_ok=True)

joblib.dump(model, os.path.join(model_dir, "station_model.pkl"))
joblib.dump(scaler, os.path.join(model_dir, "scaler.pkl"))

print("Модель и scaler успешно сохранены.")
