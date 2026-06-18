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
    # Load actual historical dataset from local cache
    historical = load_data("brent_crude_history.json")
    
    if not historical or len(historical) < 10:
        return {"error": "Insufficient historical data for ML prediction"}

    # We only want the last 90 days for short-term trend training to avoid over-smoothing
    recent_history = historical[-90:]
    
    try:
        import numpy as np
        from sklearn.linear_model import LinearRegression
        
        # Prepare Data for ML Model
        # X = days since start (integer), y = price
        start_date = datetime.strptime(recent_history[0]["date"], "%Y-%m-%d")
        X = []
        y = []
        
        for row in recent_history:
            current_date = datetime.strptime(row["date"], "%Y-%m-%d")
            days_diff = (current_date - start_date).days
            X.append([days_diff])
            y.append(row["price"])
            
        X = np.array(X)
        y = np.array(y)
        
        # Initialize and Train the Machine Learning Model
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict the next 60 days
        predictions = []
        last_date = datetime.strptime(recent_history[-1]["date"], "%Y-%m-%d")
        last_day_index = X[-1][0]
        
        # Add some slight randomized volatility to the prediction trend to make it look realistic
        # based on historical standard deviation
        std_dev = np.std(y) * 0.15 
        
        for i in range(1, 61):
            future_day_index = last_day_index + i
            # Base prediction from linear regression
            base_pred = model.predict([[future_day_index]])[0]
            # Add stochastic volatility
            noise = random.uniform(-std_dev, std_dev)
            final_pred = round(base_pred + noise, 2)
            
            future_date = last_date + timedelta(days=i)
            predictions.append({
                "date": future_date.strftime("%Y-%m-%d"),
                "price": final_pred
            })
            
        # Return a sample of historical to keep payload light, plus all predictions
        return {
            "historical": recent_history[-60:],  # Show last 60 days of actual
            "predictions": predictions          # Show next 60 days of predicted
        }
        
    except ImportError:
        return {"error": "Machine Learning dependencies not installed (scikit-learn, numpy)"}

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
