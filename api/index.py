from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import random
import os
from dotenv import load_dotenv

load_dotenv()
import requests
from datetime import datetime, timedelta
import json
from pathlib import Path
from functools import lru_cache

app = FastAPI()

# Configure CORS securely using Environment Variables
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/api/energy")
def get_energy_data():
    return {
        "status": "operational",
        "global_supply": random.randint(80, 100),
        "pipelines": [
            {"id": "nord-stream-1", "name": "Nord Stream 1", "status": "offline", "flow_rate": 0},
            {"id": "druzhba", "name": "Druzhba Pipeline", "status": "reduced", "flow_rate": 45},
            {"id": "trans-med", "name": "Trans-Mediterranean", "status": "nominal", "flow_rate": 95}
        ],
        "market_pricing": {
            "brent_crude": round(random.uniform(70, 90), 2),
            "natural_gas": round(random.uniform(2, 5), 2)
        }
    }

@app.get("/api/news")
def get_news_data():
    NEWS_API_KEY = os.getenv("320a2fabf32241a2a3c05d5ed94a3c7a")
    
    # Live API Integration (Requires NEWS_API_KEY)
    if NEWS_API_KEY:
        try:
            url = f"https://newsapi.org/v2/everything?q=geopolitics OR conflict OR energy&sortBy=publishedAt&language=en&apiKey={NEWS_API_KEY}"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                articles = []
                for i, article in enumerate(data.get("articles", [])[:10]):
                    articles.append({
                        "id": i,
                        "title": article.get("title", ""),
                        "source": article.get("source", {}).get("name", "Unknown Source"),
                        "timestamp": article.get("publishedAt", ""),
                        "url": article.get("url", ""),
                        "severity": "medium" # default
                    })
                return {"articles": articles}
        except Exception as e:
            print(f"Failed to fetch live news: {e}")

    # Fallback to Mock Data
    now = datetime.now()
    return {
        "articles": [
            {
                "id": 1,
                "title": "Global energy markets stabilize after brief shock",
                "source": "GeoEnergy Times",
                "timestamp": (now - timedelta(hours=2)).isoformat(),
                "severity": "low"
            },
            {
                "id": 2,
                "title": "New trade agreements reached in Southeast Asia",
                "source": "Global Trade Monitor",
                "timestamp": (now - timedelta(hours=5)).isoformat(),
                "severity": "medium"
            },
            {
                "id": 3,
                "title": "Supply chain disruptions continue at major ports",
                "source": "Logistics Daily",
                "timestamp": (now - timedelta(hours=12)).isoformat(),
                "severity": "high"
            }
        ]
    }

@app.get("/api/fuel-prices/predict")
def predict_fuel_price(type: str = "brentCrude"):
    # Define price ranges based on fuel type
    ranges = {
        "brentCrude": (70, 90),
        "wtiCrude": (70, 90),
        "naturalGas": (2, 5),
        "lng": (10, 15)
    }
    min_val, max_val = ranges.get(type, (50, 100))
    
    # Generate some mock historical and predicted data
    return {
        "historical": [
            {"date": "2023-01-01", "price": round(random.uniform(min_val, max_val), 2)},
            {"date": "2023-02-01", "price": round(random.uniform(min_val, max_val), 2)}
        ],
        "predictions": [
            {"date": "2023-03-01", "price": round(random.uniform(min_val, max_val), 2)},
            {"date": "2023-04-01", "price": round(random.uniform(min_val, max_val), 2)}
        ]
    }

# Add in-memory LRU caching to prevent reading the file from disk on every single request
@lru_cache(maxsize=10)
def load_data(filename):
    path = Path(__file__).parent / "data" / filename
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

@app.get("/api/conflicts")
def get_conflicts():
    return load_data("conflicts.json")

@app.get("/api/shipping-routes")
def get_shipping_routes():
    return load_data("shippingRoutes.json")

@app.get("/api/fuel-prices")
def get_fuel_prices():
    return load_data("fuelPrices.json")
