"""
train_model.py
Train a Random Forest Regressor on the synthetic rental dataset.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


DATA_PATH = "data/rental_dataset.csv"
MODEL_DIR = "model"

CATEGORICAL_FEATURES = ["sub_location", "property_type", "furnishing"]
NUMERICAL_FEATURES = [
    "distance_to_station_km", "area_sqft",
    "amenities_wifi", "amenities_ac",
    "amenities_parking", "amenities_food",
    "floor_number", "building_age_years",
]


def train():
    # ---- load data ----
    df = pd.read_csv(DATA_PATH)
    print(f"Dataset shape: {df.shape}")

    X = df.drop("rent", axis=1)
    y = df["rent"]

    # ---- preprocessor ----
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
        ],
        remainder="passthrough",  # keep numerical features as-is
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    X_train_enc = preprocessor.fit_transform(X_train)
    X_test_enc = preprocessor.transform(X_test)

    # ---- model ----
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=20,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train_enc, y_train)

    # ---- evaluation ----
    y_pred = model.predict(X_test_enc)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"\n{'='*40}")
    print(f"  MAE  : ₹{mae:,.0f}")
    print(f"  RMSE : ₹{rmse:,.0f}")
    print(f"  R²   : {r2:.4f}")
    print(f"{'='*40}\n")

    # ---- save artefacts ----
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODEL_DIR, "rent_model.pkl"))
    joblib.dump(preprocessor, os.path.join(MODEL_DIR, "preprocessor.pkl"))

    # Save metadata so the API can validate inputs
    metadata = {
        "sub_locations": sorted(df["sub_location"].unique().tolist()),
        "property_types": sorted(df["property_type"].unique().tolist()),
        "furnishing_options": sorted(df["furnishing"].unique().tolist()),
        "feature_order": CATEGORICAL_FEATURES + NUMERICAL_FEATURES,
    }
    with open(os.path.join(MODEL_DIR, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

    print("Saved model, preprocessor, and metadata to ./model/")


if __name__ == "__main__":
    train()
