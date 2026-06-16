export default function ConflictOverview({ conflict }) {
  return (
    <div className="detail-section" id="overview">
      <div className="detail-section-title">
        <span className="section-number">1</span>
        Conflict Overview
      </div>

      <div className="conflict-overview-grid">
        <div className="overview-card">
          <h3 className="overview-card-title">About the Conflict</h3>
          <p className="overview-description">{conflict.description}</p>
        </div>

        <div className="overview-card">
          {[
            { label: "Conflict Type", value: conflict.conflictType },
            { label: "Start Date", value: conflict.startDate },
            {
              label: "Parties Involved",
              value: conflict.partiesInvolved.join(", "),
            },
            { label: "Current Status", value: conflict.status },
            {
              label: "Oil Export Affected",
              value: `${conflict.oilExportAffected} million barrels / day`,
            },
            {
              label: "Natural Gas Affected",
              value: conflict.gasExportAffected > 0
                ? `${conflict.gasExportAffected} BCM / year`
                : "Not applicable",
            },
          ].map((item) => (
            <div key={item.label} className="overview-meta-item">
              <div className="meta-label">{item.label}</div>
              <div className="meta-value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
