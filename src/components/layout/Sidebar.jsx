import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { conflicts } from "../../data/conflicts";

const severityColors = {
  critical: "var(--severity-critical)",
  high:     "var(--severity-high)",
  medium:   "var(--severity-medium)",
};

import { LayoutDashboard, Map, TrendingDown, Ship, Zap, Radio } from "lucide-react";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "map",
    label: "Conflict Map",
    path: "/#map",
    isSubItem: true,
    icon: <Map size={16} />,
  },
  {
    id: "trade",
    label: "Trade Impact",
    path: "/#trade",
    isSubItem: true,
    icon: <TrendingDown size={16} />,
  },
  {
    id: "routes",
    label: "Shipping Routes",
    path: "/#routes",
    isSubItem: true,
    icon: <Ship size={16} />,
  },
  {
    id: "energy",
    label: "Energy Monitor",
    path: "/energy",
    icon: <Zap size={20} />,
  },
  {
    id: "news",
    label: "News Center",
    path: "/news",
    icon: <Radio size={20} />,
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

export default function Sidebar({ 
  isDark, 
  onToggleTheme, 
  isCollapsed, 
  sidebarWidth, 
  isDragging, 
  onStartResize, 
  onToggleCollapse, 
  onCloseMobile,
  isMobile,
  mobileTranslateX,
  isDraggingMobile
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

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

  const currentWidth = sidebarWidth;

  const asideStyle = isMobile ? {
    transform: `translateX(${mobileTranslateX}px)`,
    transition: isDraggingMobile ? "none" : "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
    width: "260px"
  } : {
    width: currentWidth,
    transform: isCollapsed ? `translateX(-100%)` : `translateX(0)`,
    transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)"
  };

  return (
    <aside 
      className="sidebar"
      style={asideStyle}
    >
      {/* Brand Header */}
      <div className="sidebar-brand" style={{ padding: "24px 24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row", gap: 0 }}>
          <div className="sidebar-logo-row" style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/logo.png" alt="GeoLet Logo" style={{ width: "38px", height: "38px", borderRadius: "6px", objectFit: "contain" }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: 1.1 }}>GeoLet</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>Global Analytics</div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 8, flexDirection: "row", alignItems: "center" }}>
            {/* Theme Toggle */}
            <button 
              onClick={onToggleTheme} 
              style={{
                width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
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
            {/* Collapse Toggle */}
            {!isMobile && (
              <button 
                onClick={onToggleCollapse} 
                style={{
                  width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s ease"
                }}
                title="Close Sidebar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="sidebar-scrollable" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
        
        {/* Navigation */}
        <div className="sidebar-section" style={{ padding: "24px 24px 10px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            
            <div style={{ 
              fontSize: 10, 
              fontWeight: 700, 
              color: "var(--text-muted)", 
              letterSpacing: "0.1em",
              marginBottom: 12,
              paddingLeft: 8
            }}>
              MISSION CONTROL
            </div>

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
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}

              <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 12, borderLeft: "2px solid var(--border)", marginLeft: 10, marginTop: 8 }}>
                {navItems.filter((i) => i.isSubItem).map((item) => (
                  <div
                    key={item.id}
                    className={`sidebar-nav-item ${isNavActive(item.path) ? "active" : ""}`}
                    onClick={() => handleNavClick(item.path)}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className="sidebar-nav-icon" style={{ width: 16, height: 16 }}>{item.icon}</span>
                    <span>{item.label}</span>
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
                title={isCollapsed ? item.label : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-divider" style={{ margin: "16px 24px" }} />

        {/* Active Conflict Zones */}
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
                  borderRadius: 8, cursor: "pointer", transition: "all 0.2s ease",
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

      </div>

      {/* Bottom Status Area */}
      <div className="sidebar-bottom" style={{ padding: "24px", background: "transparent", display: "flex", flexDirection: "column", gap: 16 }}>
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

      </div>

      {/* Desktop Edge Resizer */}
      {!isMobile && (
        <div 
          className="sidebar-resizer"
          onMouseDown={(e) => {
            e.preventDefault();
            onStartResize();
          }}
        >
          {/* Removed the Pill Resizer Handle to make it look cleaner like ChatGPT */}
        </div>
      )}
    </aside>
  );
}
