# train_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# Load training data
# Expected CSV columns: lat, lon, traffic_density, population_density, existing_stations, has_station
data = pd.read_csv("training_data.csv")

# Features used for training
feature_cols = ["traffic_density", "population_density", "existing_stations"]
X = data[feature_cols]

# Target variable: 1 if a charging station exists or should be built, 0 otherwise
y = data["has_station"]

# Normalize the feature values for better model performance
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split into training and test sets for evaluation
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# Create and train the classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict and evaluate the model
y_pred = model.predict(X_test)
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save the trained model and scaler for future use
joblib.dump(model, "station_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("\nModel and scaler saved successfully.")
