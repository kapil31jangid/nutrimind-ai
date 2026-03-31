import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

from utils import health_score, explain, suggest_swap

app = FastAPI(title="NutriMind AI API", version="1.0.0")

# Enable CORS for local development (if Next.js is running separately)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")

def load_foods():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load food database: {str(e)}")

# Models
class BudgetRequest(BaseModel):
    budget: float

class FoodItem(BaseModel):
    name: str
    calories: int
    protein: float
    fat: float
    price: float

class SwapItem(BaseModel):
    name: str
    score: float
    price: float

class RecommendationResponse(BaseModel):
    food: FoodItem
    health_score: float
    reasons: list[str]
    swap: Optional[SwapItem]

@app.post("/api/recommend", response_model=RecommendationResponse)
async def recommend_food(req: BudgetRequest):
    if req.budget <= 0:
        raise HTTPException(status_code=400, detail="Budget must be greater than ₹0.")

    foods = load_foods()
    affordable = [f for f in foods if f["price"] <= req.budget]

    if not affordable:
        raise HTTPException(status_code=404, detail=f"No food found within ₹{req.budget:.0f}.")

    # Rank by health score (descending)
    ranked = sorted(affordable, key=health_score, reverse=True)
    recommendation = ranked[0]

    score = health_score(recommendation)
    reasons = explain(recommendation, req.budget)
    swap_raw = suggest_swap(recommendation, foods, req.budget)

    swap_item = None
    if swap_raw:
        swap_item = SwapItem(
            name=swap_raw["name"],
            score=health_score(swap_raw),
            price=swap_raw["price"]
        )

    return RecommendationResponse(
        food=FoodItem(**recommendation),
        health_score=score,
        reasons=reasons,
        swap=swap_item
    )

# Static files serving
import os
if os.path.exists("out"):
    app.mount("/", StaticFiles(directory="out", html=True), name="static")

