import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>
          {label}
        </div>
        {payload.map((entry) => (
          <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.fill }} />
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{entry.name}:</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
              ${entry.value}B
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TradeImpact({ tradeData }) {
  const chartData = [
    {
      period: "Pre-Conflict",
      Exports: tradeData.preConflictExport,
      Imports: tradeData.preConflictImport,
    },
    {
      period: "Current",
      Exports: tradeData.currentExport,
      Imports: tradeData.currentImport,
    },
  ];

  const exportDrop = (
    ((tradeData.preConflictExport - tradeData.currentExport) /
      tradeData.preConflictExport) *
    100
  ).toFixed(0);

  const importDrop = (
    ((tradeData.preConflictImport - tradeData.currentImport) /
      tradeData.preConflictImport) *
    100
  ).toFixed(0);

  return (
    <div className="detail-section" id="trade">
      <div className="detail-section-title">
        <span className="section-number">3</span>
        Trade Impact — Import and Export Disruption
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Export Decline", value: `${exportDrop}%`, sub: `from $${tradeData.preConflictExport}B to $${tradeData.currentExport}B`, color: "var(--severity-critical)" },
          { label: "Import Decline", value: `${importDrop}%`, sub: `from $${tradeData.preConflictImport}B to $${tradeData.currentImport}B`, color: "var(--severity-high)" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "18px 20px",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: item.color, letterSpacing: -1 }}>
              -{item.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
              {item.sub} ({tradeData.unit})
            </div>
          </div>
        ))}
      </div>

      <div className="trade-chart-wrapper">
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>
          Pre-Conflict vs Current Trade Volumes (Billion USD)
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 0, right: 8, bottom: 0, left: -16 }} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)", paddingTop: 12 }}
            />
            <Bar dataKey="Exports" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={80} />
            <Bar dataKey="Imports" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={80} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
