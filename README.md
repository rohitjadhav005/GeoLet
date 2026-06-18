# GeoLet — Premium Geopolitical & Trade Monitor

GeoLet is a high-fidelity, real-time geopolitical intelligence dashboard designed to monitor global energy supplies, pipeline flows, geopolitical conflicts, and shipping/trade disruptions. The system combines a sleek, glassmorphic React frontend with a high-performance Python (FastAPI) backend.

## 🌟 Key Features

- **Geopolitical Surveillance Watchlist**: Real-time monitoring of active global conflict zones, including comprehensive profiles for:
  - **Ukraine / Russia** (Oil/gas trade impacts)
  - **Israel / Gaza** (Regional stability & risk status)
  - **Yemen** (Red Sea shipping disruptions)
  - **Sudan & DR Congo** (Humanitarian and mineral constraints)
  - **Myanmar** (Southeast Asia border trade status)
  - **India, Pakistan, Syria, Colombia, Haiti, and Nigeria** (Manually mapped and fully populated with real-world 2024–2025 statistics).
- **Premium Glassmorphic UI System**:
  - Soft transparent obsidian card layers (`backdrop-filter`) with glowing border gradients and micro-hover lifting transitions.
  - Full responsive harmonization across both **Light Theme** (Slate-50) and **Dark Theme** (Obsidian).
  - Modern typography pairing standard `Inter` with `JetBrains Mono` for precise data metrics.
- **Dynamic Watchlist Indicators**: Pill-shaped status badges featuring animated internal glowing dots that replicate hardware status lights.
- **Pulsing Map Markers & Popups**: A custom world map featuring pulsing radial hotspot markers and sleek hover overlays.
- **Fuel Price ML Predictions**: Future prediction models generated on-the-fly by the Python backend and visualized with interactive line charts (Brent Crude, WTI, Natural Gas, LNG).
- **Humanitarian & Infrastructure Intelligence**: Dedicated sections tracking internally displaced peoples, deficiency checklists, and population challenges with sliding animated layouts.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, React Router, Recharts, Mapbox/MapLibre GL, Lucide Icons, Vanilla CSS
- **Backend**: Python, FastAPI, Uvicorn, Pydantic, Scikit-learn (ML predictions)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **npm** (comes with Node.js)

### 1. Running the Python Backend

The Python API serves conflict data, news feeds, and machine learning price forecasts.

1. Open a terminal and navigate to the project directory:
   ```bash
   # Make sure you are in the root directory where api/ is located
   cd GeoLet-main
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install required backend libraries:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Uvicorn dev server:
   ```bash
   uvicorn api.index:app --reload --port 8000
   ```
The backend API is now active at `http://localhost:8000`.

### 2. Running the React Frontend

The Vite frontend serves the interactive React shell.

1. Open a **new** terminal window and navigate to the root directory:
   ```bash
   cd GeoLet-main
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the frontend:
   ```bash
   npm run dev
   ```
4. Access the interface in your browser at `http://localhost:5173/`.

---

## 📁 Project Structure

- `/src` — React frontend codebase (components, pages, page hooks, custom styles).
  - `/src/components` — Shared UI elements (sidebar, map, dashboard panels).
  - `/src/pages` — Core route pages (Dashboard, Country Detail, Energy, News).
- `/api` — Python FastAPI backend controller, models, and JSON databases.
  - `/api/data` — Central data repositories (conflicts, shipping routes, fuel pricing).
- `package.json` — Frontend package scripts and libraries.
- `vite.config.js` — Vite compiling configuration.
- `README.md` — Project layout documentation.
