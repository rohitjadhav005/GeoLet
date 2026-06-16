# GeoLet

GeoLet is a modern, real-time geopolitical dashboard designed to monitor global energy supplies, pipeline statuses, geopolitical conflicts, and market pricing. The application combines a sleek, dynamic React frontend with a fast, robust Python (FastAPI) backend.

## Features

- **Geopolitical Dashboard**: Monitor active global events and their severity.
- **Fuel Price ML Predictions**: View historical fuel prices and machine-learning generated future predictions.
- **Energy Monitor**: Real-time insights into global supply levels and critical infrastructure/pipeline flows.
- **News Center**: Curated intelligence feeds tracking breaking geopolitical events.
- **Interactive Map**: An interactive world map reflecting live statistics.
- **Dark/Light Mode Support**: Built-in support for different aesthetic themes.

## Tech Stack

- **Frontend**: React, Vite, React Router, Recharts
- **Backend**: Python, FastAPI, Uvicorn, Pydantic

---

## Getting Started

### Prerequisites

You need the following installed on your machine:
- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **npm** (comes with Node.js) or `yarn`

### 1. Running the Python Backend

The backend serves API endpoints for the Energy Monitor, News Center, and Fuel Price Predictions.

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment (optional but recommended):
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
The backend API will now be running at `http://localhost:8000`.

### 2. Running the React Frontend

The frontend powers the visual dashboard and connects to your Python API.

1. Open a **new** terminal window and navigate to the root directory of the project:
   ```bash
   cd GeoLet
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:5173/` in your browser.

---

## Project Structure

- `/src`: Contains the React frontend application (components, pages, styles).
- `/backend`: Contains the Python FastAPI backend (`main.py`) and dependencies.
- `package.json`: Frontend package configurations.
- `vite.config.js`: Vite build configuration.

## Available Scripts (Frontend)

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production into the `dist/` folder.
- `npm run lint`: Runs ESLint to check for code quality and syntax errors.
- `npm run preview`: Previews the built production app locally.
