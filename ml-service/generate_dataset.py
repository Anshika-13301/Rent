"""
generate_dataset.py
Generates a synthetic rental dataset for Mumbai sub-locations.
"""

import os
import numpy as np
import pandas as pd

np.random.seed(42)

NUM_ROWS = 5000

SUB_LOCATIONS = [
    "Andheri", "Bandra", "Powai", "Dadar", "Malad",
    "Thane", "Borivali", "Juhu", "Worli", "Goregaon",
]

PROPERTY_TYPES = ["PG", "1BHK", "2BHK", "Shared Room", "Studio"]

FURNISHING_OPTIONS = ["Unfurnished", "Semi-Furnished", "Fully-Furnished"]

# ---------------------------------------------------------------------------
# Pricing multipliers
# ---------------------------------------------------------------------------
LOCATION_BASE_RENT = {
    "Bandra": 18000, "Juhu": 20000, "Worli": 19000,
    "Powai": 16000, "Andheri": 14000, "Dadar": 13500,
    "Goregaon": 11000, "Malad": 10000, "Borivali": 9000,
    "Thane": 8000,
}

PROPERTY_TYPE_MULT = {
    "2BHK": 2.2, "1BHK": 1.4, "Studio": 1.0, "PG": 0.55, "Shared Room": 0.38,
}

FURNISHING_MULT = {
    "Fully-Furnished": 1.25, "Semi-Furnished": 1.10, "Unfurnished": 1.0,
}


def generate_dataset(n: int = NUM_ROWS) -> pd.DataFrame:
    rows = []
    for _ in range(n):
        loc = np.random.choice(SUB_LOCATIONS)
        ptype = np.random.choice(PROPERTY_TYPES)
        furnishing = np.random.choice(FURNISHING_OPTIONS)
        distance = round(np.random.uniform(0.1, 5.0), 1)

        # Area depends on property type
        area_ranges = {
            "PG": (100, 250), "Shared Room": (80, 200),
            "Studio": (200, 450), "1BHK": (350, 650),
            "2BHK": (600, 1200),
        }
        lo, hi = area_ranges[ptype]
        area_sqft = int(np.random.uniform(lo, hi))

        wifi = int(np.random.random() < 0.7)
        ac = int(np.random.random() < 0.5)
        parking = int(np.random.random() < 0.4)
        food = int(np.random.random() < 0.3)

        floor_number = int(np.random.randint(0, 21))
        building_age = int(np.random.randint(0, 41))

        # ---------- rent formula ----------
        base = LOCATION_BASE_RENT[loc]
        rent = base * PROPERTY_TYPE_MULT[ptype]
        rent *= FURNISHING_MULT[furnishing]

        # Distance penalty: closer → more expensive
        rent *= max(0.75, 1 - 0.06 * distance)

        # Area boost (per-sqft component)
        rent += area_sqft * 4.5

        # Amenity bonuses
        rent += wifi * 500 + ac * 800 + parking * 600 + food * 1200

        # Floor bonus (higher floors slightly pricier)
        rent += floor_number * 80

        # Old buildings slightly cheaper
        rent *= max(0.80, 1 - 0.004 * building_age)

        # Gaussian noise ±8 %
        noise = np.random.normal(1.0, 0.08)
        rent = max(2000, round(rent * noise, -2))  # round to nearest 100

        rows.append({
            "sub_location": loc,
            "property_type": ptype,
            "distance_to_station_km": distance,
            "area_sqft": area_sqft,
            "amenities_wifi": wifi,
            "amenities_ac": ac,
            "amenities_parking": parking,
            "amenities_food": food,
            "furnishing": furnishing,
            "floor_number": floor_number,
            "building_age_years": building_age,
            "rent": int(rent),
        })

    return pd.DataFrame(rows)


if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    df = generate_dataset()
    df.to_csv("data/rental_dataset.csv", index=False)
    print(f"Generated {len(df)} rows → data/rental_dataset.csv")
    print(df.describe())
