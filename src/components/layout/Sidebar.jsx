import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { conflicts } from "../../data/conflicts";

const severityColors = {
  critical: "var(--severity-critical)",
  high:     "var(--severity-high)",
  medium:   "var(--severity-medium)",
};

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    id: "map",
    label: "Conflict Map",
    path: "/#map",
    isSubItem: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
  },
  {
    id: "trade",
    label: "Trade Impact",
    path: "/#trade",
    isSubItem: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    id: "routes",
    label: "Shipping Routes",
    path: "/#routes",
    isSubItem: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    id: "energy",
    label: "Energy Monitor",
    path: "/energy",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: "news",
    label: "News Center",
    path: "/news",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
        <path d="M18 14h-8M15 18h-5"/>
      </svg>
    ),
  },
];

const countryCodes = {
  "Ukraine": "UA",
  "Russia": "RU",
  "Israel / Gaza": "IL",
  "Yemen": "YE",
  "Sudan": "SD",
  "Myanmar": "MM",
  "DR Congo": "CD",
  "Ethiopia": "ET"
};

const sortedConflicts = [...conflicts]
  .filter((c) => ["ukraine", "russia", "israel", "yemen"].includes(c.id))
  .sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2 };
    return order[a.severity] - order[b.severity];
  });

export default function Sidebar({ isDark, onToggleTheme, isCollapsed, onToggleCollapse, onCloseMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false, timeZone: "UTC",
    }) + " UTC";

  const criticalCount = conflicts.filter((c) => c.severity === "critical").length;
  const highCount = conflicts.filter((c) => c.severity === "high").length;
  const mediumCount = conflicts.filter((c) => c.severity === "medium").length;

  const isNavActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return false;
  };

  const handleNavClick = (path) => {
    if (path.startsWith("/#")) {
      if (location.pathname !== "/") {
        navigate(path);
        setTimeout(() => {
          const id = path.substring(2);
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        navigate(path);
        const id = path.substring(2);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(path);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const isShownExpanded = !isCollapsed || isHovered;

  return (
    <aside 
      className={`sidebar ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand Header */}
      <div className="sidebar-brand" style={{ padding: !isShownExpanded ? "24px 16px 20px" : "24px 24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: !isShownExpanded ? "column" : "row", gap: !isShownExpanded ? 12 : 0 }}>
          <div className="sidebar-logo-row" style={{ marginBottom: 0 }}>
            {!isShownExpanded ? (
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>G</div>
            ) : (
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: 1.1 }}>GeoLet</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>Global Analytics</div>
              </div>
            )}
          </div>
          
          <div style={{ display: "flex", gap: 8, flexDirection: !isShownExpanded ? "column" : "row", alignItems: "center" }}>
            {/* Theme Toggle */}
            <button 
              onClick={onToggleTheme} 
              style={{
                width: 32, height: 32, borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s ease"
              }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="sidebar-scrollable" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
        
        {/* Navigation */}
        <div className="sidebar-section" style={{ padding: "24px 24px 10px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Dashboard Wrapper */}
            <div style={{ 
              background: "transparent", 
              borderRadius: 0, 
              padding: "0", 
              marginBottom: "16px" 
            }}>
              {navItems.filter((i) => i.id === "dashboard").map((item) => (
                <div
                  key={item.id}
                  className={`sidebar-nav-item ${isNavActive(item.path) ? "active" : ""}`}
                  onClick={() => handleNavClick(item.path)}
                  title={isCollapsed && !isHovered ? item.label : undefined}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  {isShownExpanded && <span>{item.label}</span>}
                </div>
              ))}

              <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 12, borderLeft: "2px solid var(--border)", marginLeft: 10, marginTop: 8 }}>
                {navItems.filter((i) => i.isSubItem).map((item) => (
                  <div
                    key={item.id}
                    className={`sidebar-nav-item ${isNavActive(item.path) ? "active" : ""}`}
                    onClick={() => handleNavClick(item.path)}
                    title={isCollapsed && !isHovered ? item.label : undefined}
                  >
                    <span className="sidebar-nav-icon" style={{ width: 16, height: 16 }}>{item.icon}</span>
                    {isShownExpanded && <span>{item.label}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Other Main Links */}
            {navItems.filter((i) => !i.isSubItem && i.id !== "dashboard").map((item) => (
              <div
                key={item.id}
                className={`sidebar-nav-item ${isNavActive(item.path) ? "active" : ""}`}
                onClick={() => handleNavClick(item.path)}
                title={isCollapsed && !isHovered ? item.label : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {isShownExpanded && <span>{item.label}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-divider" style={{ margin: "16px 24px" }} />

        {/* Active Conflict Zones */}
        {isShownExpanded && (
          <div className="sidebar-section" style={{ padding: "0 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
              <div className="sidebar-section-label" style={{ padding: 0, margin: 0 }}>CONFLICT WATCHLIST</div>
              <div style={{ display: "flex", gap: 8, fontSize: 10, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ color: "var(--severity-critical)" }}>{criticalCount} CRIT</span>
                <span style={{ color: "var(--severity-high)" }}>{highCount} HIGH</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sortedConflicts.map((conflict, i) => (
                <div
                  key={conflict.id}
                  className="sidebar-conflict-item"
                  onClick={() => {
                    navigate(`/country/${conflict.id}`);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12, padding: "6px 12px", margin: "0 -12px",
                    borderRadius: 0, cursor: "pointer", transition: "all 0.2s ease",
                    border: "1px solid transparent"
                  }}
                >
                  <div style={{ fontSize: 12, marginTop: 1, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em" }}>{countryCodes[conflict.country] || "WW"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <div style={{ 
                        fontSize: 13, 
                        fontWeight: 600, 
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginRight: 8
                      }} title={conflict.country}>
                        {conflict.country}
                      </div>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: severityColors[conflict.severity], flexShrink: 0 }} />
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>Last Updated: {(i % 10) + 1}m ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Status Area */}
      <div className="sidebar-bottom" style={{ padding: "24px", background: "transparent", display: "flex", flexDirection: "column", gap: 16 }}>
        {isShownExpanded && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--positive)", boxShadow: "0 0 8px var(--positive)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.1em" }}>LIVE SYSTEM</span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>
                {formatTime(time)}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ background: "transparent", borderRadius: 0, padding: "8px 0" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.05em" }}>Monitored</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>27</div>
              </div>
              <div style={{ background: "transparent", borderRadius: 0, padding: "8px 0" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.05em" }}>Disrupted</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>5</div>
              </div>
            </div>
          </>
        )}

      </div>
    </aside>
  );
}
