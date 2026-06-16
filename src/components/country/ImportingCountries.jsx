export default function ImportingCountries({ countries }) {
  return (
    <div className="detail-section" id="importing">
      <div className="detail-section-title">
        <span className="section-number">4</span>
        Countries Importing from This Nation
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        <div className="table-responsive">
          <table className="importing-table" style={{ padding: "0 24px" }}>
            <thead>
              <tr>
                <th style={{ padding: "16px 24px 12px" }}>Country</th>
                <th style={{ padding: "16px 24px 12px" }}>Primary Commodity</th>
                <th style={{ padding: "16px 24px 12px" }}>Import Dependency</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((item, i) => (
                <tr key={i} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                  <td style={{ padding: "14px 24px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                      {item.country}
                    </div>
                  </td>
                  <td style={{ padding: "14px 24px" }}>
                    <div
                      style={{
                        display: "inline-block",
                        background: "var(--accent-blue-dim)",
                        color: "var(--accent-blue)",
                        border: "1px solid var(--accent-blue-border)",
                        borderRadius: "var(--radius-sm)",
                        padding: "3px 10px",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {item.commodity}
                    </div>
                  </td>
                  <td style={{ padding: "14px 24px", minWidth: 240 }}>
                    <div className="dependency-bar">
                      <div className="dependency-bar-track">
                        <div
                          className="dependency-bar-fill"
                          style={{ width: `${item.dependency}%` }}
                        />
                      </div>
                      <div className="dependency-pct">{item.dependency}%</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          background: "var(--severity-critical-dim)",
          border: "1px solid var(--severity-critical-border)",
          borderRadius: "var(--radius-md)",
          padding: "14px 18px",
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.65,
        }}
      >
        <strong style={{ color: "var(--severity-critical)" }}>Supply Risk Alert:</strong> Countries
        with import dependency above 40% face acute supply disruption risk. Alternative sourcing
        typically takes 6–18 months to fully establish and comes at a significant cost premium.
      </div>
    </div>
  );
}
