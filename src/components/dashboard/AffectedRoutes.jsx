import { shippingRoutes } from "../../data/shippingRoutes";

const statusColors = {
  critical: "var(--severity-critical)",
  high: "var(--severity-high)",
  medium: "var(--severity-medium)",
};

export default function AffectedRoutes() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Disrupted Shipping Routes</div>
          <div className="text-xs text-muted" style={{ marginTop: 2 }}>
            {shippingRoutes.filter((r) => r.status !== "low").length} routes affected
          </div>
        </div>
        <div className="badge badge-critical">
          <span className="badge-dot" />
          {shippingRoutes.filter((r) => r.status === "critical").length} Critical
        </div>
      </div>
      <div className="panel-body" style={{ padding: "16px 20px" }}>
        <div className="routes-list">
          {/* Header Row (Hidden on Mobile) */}
          <div className="routes-header hide-on-mobile">
            <div className="r-col r-route">Route</div>
            <div className="r-col r-status">Status</div>
            <div className="r-col r-volume">Oil Volume</div>
            <div className="r-col r-impact">Impact</div>
          </div>
          
          {/* Data Rows */}
          <div className="routes-body">
            {shippingRoutes.map((route) => (
              <div key={route.id} className="route-row">
                <div className="r-col r-route">
                  <span className="mobile-label">Route</span>
                  <div>
                    <div className="route-name">{route.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {route.dailyTransit}
                    </div>
                  </div>
                </div>
                
                <div className="r-col r-status">
                  <span className="mobile-label">Status</span>
                  <div className={`badge badge-${route.status}`}>
                    <span className="badge-dot" />
                    {route.statusLabel}
                  </div>
                </div>
                
                <div className="r-col r-volume">
                  <span className="mobile-label">Volume</span>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                    {route.oilVolume}
                  </div>
                </div>
                
                <div className="r-col r-impact">
                  <span className="mobile-label">Impact</span>
                  <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--text-secondary)" }}>
                    {route.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
