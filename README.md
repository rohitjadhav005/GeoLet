# GeoLet — Premium Geopolitical & Trade Monitor

> A high-fidelity, real-time geopolitical intelligence dashboard combining a glassmorphic React frontend with a Python FastAPI backend featuring live ML-powered fuel price forecasts.

![GeoLet Dashboard](public/favicon.png)

---

## 🌟 Key Features

- **Geopolitical Watchlist** — Real-time monitoring of active global conflict zones (Ukraine, Gaza, Yemen, Sudan, Myanmar, and more) with comprehensive trade and humanitarian profiles.
- **Interactive World Map** — Pulsing radial hotspot markers with sleek hover popups powered by MapLibre GL.
- **ML Fuel Forecasting** — Scikit-learn linear regression models generate 60-day price predictions for Brent Crude, WTI, Natural Gas, and LNG — visualized via Recharts.
- **Energy Monitor** — Live pipeline flow status, market pricing, and supply-chain disruption tracking.
- **News Center** — Live geopolitical news feed via NewsAPI (with fallback mock data).
- **Premium Glassmorphic UI** — Obsidian dark mode & slate light mode with backdrop-filter layers, glowing borders, and micro-hover animations.
- **Fully Responsive** — Swipe-to-open mobile sidebar drawer and desktop drag-to-resize sidebar.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router v7 |
| Map | MapLibre GL, react-map-gl |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Python, FastAPI, Uvicorn |
| ML | Scikit-learn, NumPy, Pandas |
| Database | SQLite (via SQLAlchemy) |
| Deployment | Docker, Render, Vercel |

---

## 📁 Project Structure

```
GeoLet-main/
│
├── api/                        # Python FastAPI backend
│   ├── data/                   # Static JSON data repositories
│   │   ├── conflicts.json      # Conflict zone profiles
│   │   ├── fuelPrices.json     # Historical fuel pricing data
│   │   ├── shippingRoutes.json # Shipping lane data
│   │   └── brent_crude_history.json  # Brent crude time-series for ML
│   ├── index.py                # FastAPI app — all API routes
│   ├── database.py             # SQLAlchemy engine & ORM models
│   ├── fetch_dataset.py        # Script to pull/refresh data
│   ├── migrate_db.py           # DB migration utility
│   └── requirements.txt        # Python dependencies
│
├── src/                        # React frontend source
│   ├── components/
│   │   ├── country/            # Country detail sub-components
│   │   │   ├── AffectedProducts.jsx
│   │   │   ├── ConflictOverview.jsx
│   │   │   ├── HeroSlider.jsx
│   │   │   ├── HumanitarianImpact.jsx
│   │   │   ├── ImportingCountries.jsx
│   │   │   ├── ShippingRoutes.jsx
│   │   │   └── TradeImpact.jsx
│   │   ├── dashboard/          # Dashboard panel components
│   │   │   ├── AffectedRoutes.jsx
│   │   │   ├── FuelPriceChart.jsx
│   │   │   └── StatCard.jsx
│   │   ├── layout/             # Global layout
│   │   │   └── Sidebar.jsx
│   │   └── map/                # Interactive world map
│   │       └── WorldMap.jsx
│   ├── data/                   # Frontend static data helpers
│   │   ├── conflicts.js
│   │   ├── fuelPrices.js
│   │   └── shippingRoutes.js
│   ├── hooks/                  # Custom React hooks
│   │   └── useScrollReveal.js
│   ├── pages/                  # Top-level route pages
│   │   ├── Dashboard.jsx
│   │   ├── CountryDetail.jsx
│   │   ├── EnergyMonitor.jsx
│   │   └── NewsCenter.jsx
│   ├── App.jsx                 # Root component & router shell
│   ├── App.css                 # App-level layout styles
│   ├── index.css               # Global design system & tokens
│   └── main.jsx                # Vite entry point
│
├── public/                     # Static assets (served as-is)
│   ├── favicon.png
│   ├── favicon.svg
│   ├── icons.svg
│   └── logo.png
│
├── .env.example                # Environment variable template
├── .gitignore
├── backend.Dockerfile
├── frontend.Dockerfile
├── docker-compose.yml          # Orchestrates both services
├── eslint.config.js
├── index.html                  # Vite HTML entry
├── package.json
├── render.yaml                 # Render.com deployment config
├── vercel.json                 # Vercel routing config
└── vite.config.js              # Vite + dev proxy config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.10+

### 1. Clone & Configure Environment

```bash
git clone https://github.com/rohitjadhav005/GeoLet.git
cd GeoLet-main

# Copy the environment template and fill in your values
cp .env.example .env
```

Edit `.env` and set your `NEWS_API_KEY` (optional — app works without it using mock data).

### 2. Run the Python Backend

```bash
# Create & activate a virtual environment
python -m venv venv

# Windows PowerShell
.\venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r api/requirements.txt

# Start the API server
uvicorn api.index:app --reload --port 8000
```

The API is now live at **http://localhost:8000**

### 3. Run the React Frontend

In a new terminal:

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> ℹ️ The Vite dev server automatically proxies `/api/*` requests to `http://localhost:8000` — no manual URL switching needed.

### 4. Run with Docker (Optional)

```bash
docker-compose up --build
```

Both services start together: backend on `:8000`, frontend on `:5173`.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/conflicts` | All conflict zone data |
| GET | `/api/shipping-routes` | Global shipping route status |
| GET | `/api/fuel-prices` | Current fuel price data |
| GET | `/api/fuel-prices/predict?type=brentCrude` | ML 60-day price forecast |
| GET | `/api/energy` | Energy pipeline status |
| GET | `/api/news` | Live/mock geopolitical news |

---

## 📦 Available Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Build production bundle
npm run preview    # Preview production build locally
npm run lint       # Run ESLint checks
npm run lint:fix   # Auto-fix lint issues
```

---

## 🚢 Deployment

- **Backend** — Deploy to [Render.com](https://render.com) using `render.yaml`
- **Frontend** — Deploy to [Vercel](https://vercel.com) using `vercel.json`
- **Full Stack** — Use `docker-compose.yml` for containerized self-hosting

---

## 📄 License

MIT © Rohit Jadhav
