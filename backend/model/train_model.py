import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os
from api_utils import get_training_data

# Get data from the database
data = get_training_data()

# Convert to DataFrame
columns = ["traffic_density", "population_density", "existing_stations", "has_station"]
df = pd.DataFrame(data, columns=columns)

# Check the data structure to ensure correctness
print("Sample data from database:")
print(df.head())

# Split data into features (X) and target variable (y)
X = df[["traffic_density", "population_density", "existing_stations"]]
y = df["has_station"]

# Scale the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train a logistic regression model
model = LogisticRegression()
model.fit(X_scaled, y)

# Save the model and scaler
model_dir = os.path.join(os.path.dirname(__file__), 'model')
os.makedirs(model_dir, exist_ok=True)

joblib.dump(model, os.path.join(model_dir, "model.pkl"))
joblib.dump(scaler, os.path.join(model_dir, "scaler.pkl"))

print("Model and scaler successfully saved.")
