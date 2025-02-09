import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

# Load dataset
df = pd.read_csv("crop_yield_data.csv")

# Encode categorical values
encoder = LabelEncoder()
df["soil_type"] = encoder.fit_transform(df["soil_type"])  # Convert soil type to numbers

# Define features and target variable
X = df.drop(columns=["yield"])  # Features (rainfall, temperature, soil_type, area)
y = df["yield"]  # Target variable

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
print(f"Mean Absolute Error: {mean_absolute_error(y_test, y_pred)}")
print(f"R2 Score: {r2_score(y_test, y_pred)}")

# Save model and encoder
pickle.dump(model, open("finalized_model.sav", "wb"))
pickle.dump(encoder, open("label_encoder.pkl", "wb"))
