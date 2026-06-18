import yfinance as yf
import json
from pathlib import Path
import datetime

def fetch_and_save():
    print("Fetching Brent Crude (BZ=F) from Yahoo Finance...")
    ticker = yf.Ticker("BZ=F")
    
    # Get historical market data for the last 1 year
    hist = ticker.history(period="1y")
    
    # Format the data
    data = []
    for date, row in hist.iterrows():
        # date is a pandas Timestamp
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "price": round(row["Close"], 2)
        })
    
    # Ensure directory exists
    output_dir = Path(__file__).parent / "data"
    output_dir.mkdir(exist_ok=True)
    
    output_path = output_dir / "brent_crude_history.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    print(f"Successfully saved {len(data)} records to {output_path}")

if __name__ == "__main__":
    fetch_and_save()
