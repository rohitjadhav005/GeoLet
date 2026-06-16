const statusBadgeClass = {
  "Severely Disrupted": "critical",
  "Suspended": "critical",
  "Active Threat Zone": "critical",
  "Infrastructure Destroyed": "critical",
  "High Risk": "high",
  "Elevated Risk": "medium",
  "Partially Restored": "medium",
  "Disrupted": "high",
};

export default function ShippingRoutes({ routes }) {
  if (!routes || routes.length === 0) {
    return (
      <div className="detail-section" id="routes">
        <div className="detail-section-title">
          <span className="section-number">5</span>
          Disrupted Shipping Routes
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "32px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 14,
          }}
        >
          No direct maritime shipping disruptions recorded for this conflict zone.
          Trade impacts are primarily through overland routes and sanctions.
        </div>
      </div>
    );
  }

  return (
    <div className="detail-section" id="routes">
      <div className="detail-section-title">
        <span className="section-number">5</span>
        Disrupted Shipping Routes
      </div>

      <div className="routes-grid">
        {routes.map((route, i) => {
          const badgeClass = statusBadgeClass[route.status] || "medium";
          return (
            <div
              key={i}
              className="route-card animate-fadeInUp"
              style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
            >
              <div className="route-card-header">
                <div className="route-card-name">{route.name}</div>
                <div className={`badge badge-${badgeClass}`} style={{ whiteSpace: "nowrap" }}>
                  <span className="badge-dot" />
                  {route.status}
                </div>
              </div>
              <div className="route-card-body">{route.impact}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
