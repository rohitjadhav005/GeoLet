import StatCard from "../components/dashboard/StatCard";
import WorldMap from "../components/map/WorldMap";
import FuelPriceChart from "../components/dashboard/FuelPriceChart";
import AffectedRoutes from "../components/dashboard/AffectedRoutes";
import { activeConflictCount, totalOilAffected, totalPeopleInNeed } from "../data/conflicts";
import { shippingRoutes } from "../data/shippingRoutes";

const disruptedRoutes = shippingRoutes.filter((r) => r.status === "critical" || r.status === "high").length;

export default function Dashboard() {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Global Dashboard</h1>
          <p className="page-subtitle">Real-time overview of active conflicts and trade disruptions.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
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
      <div className="bottom-panels" id="trade">
        <FuelPriceChart />
        <div id="routes">
          <AffectedRoutes />
        </div>
      </div>
    </div>
  );
}
