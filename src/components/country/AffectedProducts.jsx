const severityColors = {
  critical: "var(--severity-critical)",
  high: "var(--severity-high)",
  medium: "var(--severity-medium)",
  low: "var(--severity-low)",
};

export default function AffectedProducts({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="detail-section" id="products">
        <div className="detail-section-title">
          <span className="section-number">2</span>
          Affected Products and Commodities
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
          No specific commodity disruption data is currently available.
        </div>
      </div>
    );
  }

  return (
    <div className="detail-section" id="products">
      <div className="detail-section-title">
        <span className="section-number">2</span>
        Affected Products and Commodities
      </div>

      <div className="products-grid">
        {products.map((product, i) => {
          const color = severityColors[product.severity] || "var(--accent-blue)";
          return (
            <div
              key={product.name}
              className="product-card animate-fadeInUp"
              style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                <div className="product-name">{product.name}</div>
                <div className={`badge badge-${product.severity}`}>{product.severity}</div>
              </div>

              <div className="product-impact-row">
                <div>
                  <div
                    className="product-impact-pct"
                    style={{ color }}
                  >
                    {product.impact}%
                  </div>
                  <div className="product-unit">{product.unit}</div>
                </div>
              </div>

              <div className="impact-bar-track">
                <div
                  className="impact-bar-fill"
                  style={{
                    width: `${product.impact}%`,
                    background: color,
                    opacity: 0.75,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
