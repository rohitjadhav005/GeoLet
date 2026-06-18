import { useState, useEffect } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import { Zap, TrendingUp, Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function EnergyMonitor() {
  useScrollReveal();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current energy status and predicted prices concurrently
    Promise.all([
      fetch("/api/energy").then(res => res.json()),
      fetch("/api/fuel-prices/predict?type=brentCrude").then(res => res.json())
    ])
      .then(([energyData, priceData]) => {
        setData(energyData);
        
        // Format chart data
        const formattedChart = [
          ...(priceData.historical || []).map(d => ({ ...d, type: "Historical" })),
          ...(priceData.predictions || []).map(d => ({ ...d, type: "Predicted" }))
        ];
        setChartData(formattedChart);
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch energy data:", err);
        setLoading(false);
      });
  }, []);

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'nominal':
      case 'operational': return <CheckCircle2 size={18} color="var(--severity-low, #10b981)" />;
      case 'reduced': return <AlertTriangle size={18} color="var(--severity-medium, #f59e0b)" />;
      case 'offline': return <XCircle size={18} color="var(--severity-critical, #ef4444)" />;
      default: return <Activity size={18} color="var(--text-secondary)" />;
    }
  };

  return (
    <div className="dashboard-content" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="page-header reveal-left">
        <div>
          <h1 className="page-title">Energy Monitor</h1>
          <p className="page-subtitle">Real-time global energy supply, pipeline statuses, and market pricing.</p>
        </div>
      </div>

      <div style={{ padding: "32px 24px", color: "var(--text-muted)" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
            <div style={{ animation: "pulse 2s infinite", opacity: 0.6 }}>Synchronizing with Global Grid...</div>
          </div>
        ) : data ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Top Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }} className="reveal-up delay-100">
              
              <div className="panel card-business" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)" }}>
                  <Zap size={20} />
                  <span style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Global Supply</span>
                </div>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)" }}>{data.global_supply}%</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Status: <span style={{ color: "var(--text-primary)", textTransform: "capitalize" }}>{data.status}</span></div>
              </div>

              <div className="panel card-business" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)" }}>
                  <TrendingUp size={20} />
                  <span style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Brent Crude</span>
                </div>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)" }}>${data.market_pricing.brent_crude}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>USD / Barrel</div>
              </div>

              <div className="panel card-business" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)" }}>
                  <Activity size={20} />
                  <span style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Natural Gas</span>
                </div>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)" }}>${data.market_pricing.natural_gas}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>USD / MMBtu</div>
              </div>

            </div>

            {/* Main Content Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
              
              {/* Chart Section */}
              <div className="panel card-business reveal-up delay-200" style={{ padding: "28px", flex: "1 1 500px", minWidth: 0 }}>
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ color: "var(--text-primary)", fontSize: "18px", margin: "0 0 4px 0" }}>Brent Crude Price Forecast</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>Historical data vs 60-day prediction model</p>
                </div>
                
                <div style={{ width: "100%", height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-blue, #3b82f6)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--accent-blue, #3b82f6)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle, rgba(255,255,255,0.05))" vertical={false} />
                      <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--surface, #1e1e1e)", border: "1px solid var(--border)", borderRadius: "8px" }}
                        itemStyle={{ color: "var(--text-primary)" }}
                        formatter={(value) => [`$${value}`, "Price"]}
                      />
                      <Area type="monotone" dataKey="price" stroke="var(--accent-blue, #3b82f6)" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pipeline Status */}
              <div className="panel card-business reveal-up delay-300" style={{ padding: "28px", flex: "1 1 300px", minWidth: 0 }}>
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ color: "var(--text-primary)", fontSize: "18px", margin: "0 0 4px 0" }}>Strategic Pipelines</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>Live flow rates and operational status</p>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {data.pipelines.map(pipe => (
                    <div key={pipe.id} style={{ 
                      display: "flex", alignItems: "center", justifyContent: "space-between", 
                      padding: "16px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "12px" 
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ 
                          width: "40px", height: "40px", borderRadius: "10px", background: "var(--bg-card)", 
                          display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-subtle)" 
                        }}>
                          {getStatusIcon(pipe.status)}
                        </div>
                        <div>
                          <div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "15px", marginBottom: "2px" }}>{pipe.name}</div>
                          <div style={{ color: "var(--text-secondary)", fontSize: "13px", textTransform: "capitalize" }}>{pipe.status}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "16px" }}>{pipe.flow_rate}%</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Flow Rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Failed to load data. Please check your connection or backend configuration.</p>
          </div>
        )}
      </div>
    </div>
  );
}
