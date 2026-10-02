"""
main.py – FastAPI ML Prediction Service
"""

import os
import json
import logging
from contextlib import asynccontextmanager

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ml-service")

# ---------------------------------------------------------------------------
# Globals populated at startup
# ---------------------------------------------------------------------------
model = None
preprocessor = None
metadata: dict = {}

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")


# ---------------------------------------------------------------------------
# Lifespan (replaces deprecated on_event)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, preprocessor, metadata
    try:
        model = joblib.load(os.path.join(MODEL_DIR, "rent_model.pkl"))
        preprocessor = joblib.load(os.path.join(MODEL_DIR, "preprocessor.pkl"))
        with open(os.path.join(MODEL_DIR, "metadata.json")) as f:
            metadata = json.load(f)
        logger.info("Model, preprocessor, and metadata loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load model artefacts: {e}")
    yield


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Rent Predictor ML Service",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class PredictionInput(BaseModel):
    sub_location: str = Field(..., example="Andheri")
    property_type: str = Field(..., example="1BHK")
    distance_to_station_km: float = Field(..., ge=0.1, le=10.0, example=1.5)
    area_sqft: int = Field(..., ge=50, le=5000, example=450)
    amenities_wifi: int = Field(..., ge=0, le=1, example=1)
    amenities_ac: int = Field(..., ge=0, le=1, example=0)
    amenities_parking: int = Field(..., ge=0, le=1, example=1)
    amenities_food: int = Field(..., ge=0, le=1, example=0)
    furnishing: str = Field(..., example="Semi-Furnished")
    floor_number: int = Field(..., ge=0, le=50, example=5)
    building_age_years: int = Field(..., ge=0, le=100, example=10)


class RentRange(BaseModel):
    min: float
    max: float


class PredictionOutput(BaseModel):
    predicted_rent: float
    rent_range: RentRange
    confidence: str


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}


@app.get("/metadata")
def get_metadata():
    return metadata


@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    if model is None or preprocessor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    # Build a single-row DataFrame matching training feature order
    row = {
        "sub_location": data.sub_location,
        "property_type": data.property_type,
        "furnishing": data.furnishing,
        "distance_to_station_km": data.distance_to_station_km,
        "area_sqft": data.area_sqft,
        "amenities_wifi": data.amenities_wifi,
        "amenities_ac": data.amenities_ac,
        "amenities_parking": data.amenities_parking,
        "amenities_food": data.amenities_food,
        "floor_number": data.floor_number,
        "building_age_years": data.building_age_years,
    }
    df = pd.DataFrame([row])

    try:
        X_enc = preprocessor.transform(df)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Preprocessing error: {exc}")

    # Mean prediction
    predicted = float(model.predict(X_enc)[0])

    # Per-tree predictions for confidence interval
    tree_preds = np.array([t.predict(X_enc)[0] for t in model.estimators_])
    pred_min = float(np.percentile(tree_preds, 10))
    pred_max = float(np.percentile(tree_preds, 90))
    std = float(np.std(tree_preds))
    cv = std / predicted if predicted else 0

    if cv < 0.08:
        confidence = "High"
    elif cv < 0.15:
        confidence = "Medium"
    else:
        confidence = "Low"

    return PredictionOutput(
        predicted_rent=round(predicted, -2),
        rent_range=RentRange(min=round(pred_min, -2), max=round(pred_max, -2)),
        confidence=confidence,
    )


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
