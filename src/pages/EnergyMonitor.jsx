import { useState, useEffect } from "react";

export default function EnergyMonitor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/energy")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch energy data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Energy Monitor</h1>
          <p className="page-subtitle">Real-time global energy supply, pipeline statuses, and market pricing.</p>
        </div>
      </div>
      <div style={{ padding: "40px 24px", color: "var(--text-muted)", textAlign: "center" }}>
        {loading ? (
          <p>Loading energy data from Python backend...</p>
        ) : data ? (
          <div style={{ textAlign: "left", display: "grid", gap: "20px" }}>
            <div className="panel" style={{ padding: "20px" }}>
              <h2 style={{ color: "var(--text-primary)" }}>Status: {data.status}</h2>
              <p>Global Supply Level: {data.global_supply}%</p>
              <h3 style={{ marginTop: "20px" }}>Market Pricing</h3>
              <p>Brent Crude: ${data.market_pricing.brent_crude}</p>
              <p>Natural Gas: ${data.market_pricing.natural_gas}</p>
            </div>
            <div className="panel" style={{ padding: "20px" }}>
              <h3 style={{ color: "var(--text-primary)" }}>Pipelines</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {data.pipelines.map(pipe => (
                  <li key={pipe.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid var(--border)", borderRadius: "8px" }}>
                    <strong>{pipe.name}</strong> - Status: {pipe.status} ({pipe.flow_rate}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>Failed to load data. Ensure the Python backend is running on port 8000.</p>
        )}
      </div>
    </div>
  );
}
