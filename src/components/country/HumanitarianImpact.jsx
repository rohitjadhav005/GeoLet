export default function HumanitarianImpact({ humanitarian }) {
  return (
    <div className="detail-section" id="humanitarian">
      <div className="detail-section-title">
        <span className="section-number">6</span>
        Humanitarian Impact and Population Challenges
      </div>

      {/* Displacement Statistics */}
      <div className="displaced-stats">
        {[
          { label: "Internally Displaced", value: humanitarian.displaced },
          { label: "Refugees Abroad", value: humanitarian.refugeesAbroad },
          { label: "People Needing Aid", value: humanitarian.needingAid },
        ].map((stat) => (
          <div key={stat.label} className="displaced-stat">
            <div className="displaced-stat-value">{stat.value}</div>
            <div className="displaced-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="humanitarian-grid">
        {/* Deficiencies */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 12,
            }}
          >
            Critical Deficiencies
          </div>
          <div className="deficiency-grid">
            {humanitarian.deficiencies.map((def, i) => (
              <div key={i} className="deficiency-card animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <div className="deficiency-category">{def.category}</div>
                <div className="deficiency-detail">{def.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 12,
            }}
          >
            Key Challenges Facing the Population
          </div>
          <div className="challenges-list">
            {humanitarian.challenges.map((challenge, i) => (
              <div key={i} className="challenge-item animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <div className="challenge-num">0{i + 1}</div>
                <div>{challenge}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
