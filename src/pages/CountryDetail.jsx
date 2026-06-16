import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { conflictsByCountry } from "../data/conflicts";
import ConflictOverview from "../components/country/ConflictOverview";
import AffectedProducts from "../components/country/AffectedProducts";
import TradeImpact from "../components/country/TradeImpact";
import ImportingCountries from "../components/country/ImportingCountries";
import ShippingRoutes from "../components/country/ShippingRoutes";
import HumanitarianImpact from "../components/country/HumanitarianImpact";
import HeroSlider from "../components/country/HeroSlider";

const anchorSections = [
  { id: "overview", label: "Conflict Overview" },
  { id: "products", label: "Affected Products" },
  { id: "trade", label: "Trade Impact" },
  { id: "importing", label: "Importing Countries" },
  { id: "routes", label: "Shipping Routes" },
  { id: "humanitarian", label: "Humanitarian Impact" },
];

const severityLabels = {
  critical: "Critical Severity",
  high: "High Severity",
  medium: "Medium Severity",
};

export default function CountryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const conflict = conflictsByCountry[id];
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 140;
      for (const section of anchorSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!conflict) {
    return (
      <div className="detail-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: "var(--text-muted)", marginBottom: 12 }}>
            404
          </div>
          <div style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 24 }}>
            Country data not found
          </div>
          <button
            className="detail-back-btn"
            onClick={() => navigate("/")}
            style={{ margin: "0 auto" }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 130;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="detail-page">
      {/* Hero Section */}
      <div className="detail-hero" style={{ position: "relative" }}>
        <HeroSlider countryId={id} />
        
        <div className="detail-hero-content" style={{ position: "relative", zIndex: 10 }}>
          <button className="detail-back-btn" onClick={() => navigate("/")}>
            &larr; Back to Dashboard
          </button>

        <div className="detail-hero-meta">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
              <h1 className="detail-country-name">{conflict.country}</h1>
              <div className={`badge badge-${conflict.severity}`} style={{ fontSize: 13, padding: "5px 14px" }}>
                <span className="badge-dot" />
                {severityLabels[conflict.severity]}
              </div>
            </div>

            <div className="detail-badges">
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "4px 12px",
                }}
              >
                {conflict.conflictType}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "4px 12px",
                }}
              >
                Since {conflict.startDate}
              </div>
            </div>

            <div className="detail-status text-secondary">
              Status: <strong style={{ color: "var(--text-primary)" }}>{conflict.status}</strong>
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="detail-hero-stats">
          <div className="detail-stat">
            <div className="detail-stat-label">Oil Export Affected</div>
            <div className="detail-stat-value" style={{ color: "var(--severity-critical)" }}>
              {conflict.oilExportAffected}
            </div>
            <div className="detail-stat-unit">Million barrels / day</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">Gas Affected</div>
            <div className="detail-stat-value" style={{ color: "var(--severity-high)" }}>
              {conflict.gasExportAffected > 0 ? `${conflict.gasExportAffected}` : "N/A"}
            </div>
            <div className="detail-stat-unit">
              {conflict.gasExportAffected > 0 ? "BCM / year" : "Not applicable"}
            </div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">People Needing Aid</div>
            <div className="detail-stat-value" style={{ color: "var(--severity-medium)" }}>
              {conflict.humanitarian.needingAid}
            </div>
            <div className="detail-stat-unit">Humanitarian assistance required</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">Commodities Affected</div>
            <div className="detail-stat-value" style={{ color: "var(--accent-blue)" }}>
              {conflict.affectedProducts.length}
            </div>
            <div className="detail-stat-unit">
              {conflict.affectedProducts.filter((p) => p.severity === "critical").length} critical, {" "}
              {conflict.affectedProducts.filter((p) => p.severity === "high").length} high
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Sticky Anchor Navigation */}
      <nav className="detail-anchor-nav">
        {anchorSections.map((section) => (
          <div
            key={section.id}
            className={`anchor-link ${activeSection === section.id ? "active" : ""}`}
            onClick={() => scrollToSection(section.id)}
          >
            {section.label}
          </div>
        ))}
      </nav>

      {/* Scrollable Sections */}
      <div className="detail-sections">
        <ConflictOverview conflict={conflict} />
        <AffectedProducts products={conflict.affectedProducts} />
        <TradeImpact tradeData={conflict.tradeImpact} />
        <ImportingCountries countries={conflict.importingCountries} />
        <ShippingRoutes routes={conflict.shippingRoutes} />
        <HumanitarianImpact humanitarian={conflict.humanitarian} />
      </div>
    </div>
  );
}
