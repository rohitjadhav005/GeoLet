import StatCard from "../components/dashboard/StatCard";
import WorldMap from "../components/map/WorldMap";
import FuelPriceChart from "../components/dashboard/FuelPriceChart";
import AffectedRoutes from "../components/dashboard/AffectedRoutes";
import { activeConflictCount, totalOilAffected, totalPeopleInNeed } from "../data/conflicts";
import { shippingRoutes } from "../data/shippingRoutes";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useScrollReveal from "../hooks/useScrollReveal";

const disruptedRoutes = shippingRoutes.filter((r) => r.status === "critical" || r.status === "high").length;

export default function Dashboard() {
  const navigate = useNavigate();
  useScrollReveal();

  useEffect(() => {
    const ids = ["overview", "map", "trade", "routes"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navigate(`/#${entry.target.id}`, { replace: true });
        }
      });
    }, { threshold: 0.5 });

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navigate]);

  return (
    <div className="dashboard-content">
      <div className="page-header reveal-left">
        <div>
          <h1 className="page-title">Global Dashboard</h1>
          <p className="page-subtitle">Real-time overview of active conflicts and trade disruptions.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid reveal-up delay-100" id="overview">
        <StatCard
          label="Active Conflict Zones"
          value={activeConflictCount}
          sub="Monitored globally"
          accentColor="var(--severity-critical)"
          delay={0}
        />
        <StatCard
          label="Oil Supply Affected"
          value={`${totalOilAffected}`}
          sub="Million barrels per day"
          accentColor="var(--severity-high)"
          delay={0.05}
        />
        <StatCard
          label="Shipping Routes Disrupted"
          value={disruptedRoutes}
          sub="Critical or high-risk status"
          accentColor="var(--severity-medium)"
          delay={0.1}
        />
        <StatCard
          label="People Requiring Aid"
          value={totalPeopleInNeed}
          sub="Across all conflict zones"
          accentColor="var(--accent)"
          delay={0.15}
        />
      </div>

      {/* Map Section */}
      <div className="map-section" id="map">
        <WorldMap />
      </div>

      {/* Bottom Panels */}
      <div className="bottom-panels reveal-up delay-200" id="trade">
        <FuelPriceChart />
        <div id="routes">
          <AffectedRoutes />
        </div>
      </div>
    </div>
  );
}
