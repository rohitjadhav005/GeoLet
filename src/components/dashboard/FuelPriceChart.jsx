import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  brentCrude,
  wtiCrude,
  naturalGas,
  lng,
  fuelSummary,
} from "../../data/fuelPrices";

const datasets = {
  brentCrude: { data: brentCrude, key: "brentCrude" },
  wtiCrude: { data: wtiCrude, key: "wtiCrude" },
  naturalGas: { data: naturalGas, key: "naturalGas" },
  lng: { data: lng, key: "lng" },
};

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          padding: "10px 14px",
        }}
      >
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: payload[0].stroke,
          }}
        >
          {payload[0].value.toFixed(2)}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{unit}</div>
      </div>
    );
  }
  return null;
};

export default function FuelPriceChart() {
  const [active, setActive] = useState("brentCrude");
  const [mlData, setMlData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ML predictions from Python Backend
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/fuel-prices/predict?type=${active}`)
      .then(res => {
        if (!res.ok) throw new Error("Backend response was not ok");
        return res.json();
      })
      .then(data => {
        if (!isMounted) return;
        // Combine historical and predictions for the chart
        const combined = [...(data.historical || []), ...(data.predictions || [])];
        setMlData(combined);
        setIsLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error("Backend fetch error:", err);
        setMlData(datasets[active].data);
        setIsLoading(false);
      });
      return () => { isMounted = false; };
  }, [active]);

  const info = fuelSummary[active];
  const isPositive = parseFloat(info.change) >= 0;

  return (
    <div className="panel card-business">
      <div className="panel-header">
        <div>
          <div className="panel-title">Fuel Price Trends</div>
          <div className="text-xs text-muted" style={{ marginTop: 2 }}>
            30-day market data
          </div>
        </div>
        <div className="chart-tabs">
          {Object.entries(fuelSummary).map(([key, val]) => (
            <div
              key={key}
              className={`chart-tab ${active === key ? "active" : ""}`}
              onClick={() => setActive(key)}
            >
              {key === "naturalGas" ? "Nat Gas" : val.label.split(" ")[0]}
            </div>
          ))}
        </div>
      </div>
      <div className="panel-body">
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", letterSpacing: -1 }}>
            ${info.current.toFixed(2)}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: isPositive ? "var(--color-negative)" : "var(--color-positive)",
            }}
          >
            {isPositive ? "+" : ""}{info.change}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{info.unit}</div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "var(--text-muted)", fontSize: 14 }}>
              Running ML Predictions...
            </div>
          ) : (
            <LineChart data={mlData} margin={{ top: 0, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip unit={info.unit} />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={info.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: info.color, strokeWidth: 0 }}
            />
          </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
