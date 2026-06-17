import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import CountryDetail from "./pages/CountryDetail";
import EnergyMonitor from "./pages/EnergyMonitor";
import NewsCenter from "./pages/NewsCenter";
import "./App.css";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Resizable sidebar states
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isDragging, setIsDragging] = useState(false);
  
  // Mobile touch drawer states
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileTranslateX, setMobileTranslateX] = useState(-260);
  const [isDraggingMobile, setIsDraggingMobile] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove("theme-light");
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
      document.body.classList.add("theme-light");
    }
  }, [isDark]);

  // Window resize listener to handle viewport mode shifts
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync mobile drawer translate position with open state
  useEffect(() => {
    if (isMobileSidebarOpen) {
      setMobileTranslateX(0);
    } else {
      setMobileTranslateX(-260);
    }
  }, [isMobileSidebarOpen]);

  // Desktop drag-to-resize listener
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newWidth = e.clientX;
      if (newWidth < 120) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
        setSidebarWidth(Math.max(160, Math.min(360, newWidth)));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Block cursor shifts and text selections while resizing
  useEffect(() => {
    if (isDragging) {
      document.body.classList.add("is-resizing");
    } else {
      document.body.classList.remove("is-resizing");
    }
  }, [isDragging]);

  // Touch Swipe & Drag-to-Slide Handlers for Mobile Drawer
  useEffect(() => {
    if (!isMobile) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let initialTranslateX = 0;
    let isTracking = false;

    const handleTouchStart = (e) => {
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      touchStartX = clientX;
      touchStartY = clientY;
      initialTranslateX = isMobileSidebarOpen ? 0 : -260;

      // Track if sidebar is open, or starting near the left edge
      if (isMobileSidebarOpen || clientX < 45) {
        isTracking = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isTracking) return;

      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      const diffX = clientX - touchStartX;
      const diffY = clientY - touchStartY;

      // If scrolling vertically, cancel swipe tracking
      if (!isDraggingMobile && Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
        isTracking = false;
        return;
      }

      if (Math.abs(diffX) > 10 && !isDraggingMobile) {
        setIsDraggingMobile(true);
      }

      if (isDraggingMobile) {
        if (e.cancelable) e.preventDefault();
        let nextTranslateX = initialTranslateX + diffX;
        nextTranslateX = Math.max(-260, Math.min(0, nextTranslateX));
        setMobileTranslateX(nextTranslateX);
      }
    };

    const handleTouchEnd = () => {
      if (!isTracking) return;
      isTracking = false;

      if (isDraggingMobile) {
        setIsDraggingMobile(false);
        // Snap open/close thresholds
        if (mobileTranslateX > -170) {
          setIsMobileSidebarOpen(true);
          setMobileTranslateX(0);
        } else {
          setIsMobileSidebarOpen(false);
          setMobileTranslateX(-260);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, isMobileSidebarOpen, isDraggingMobile, mobileTranslateX]);

  return (
    <BrowserRouter>
      <div className={`app-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""} ${isMobileSidebarOpen ? "mobile-sidebar-open" : ""}`}>
        <Sidebar 
          isDark={isDark} 
          onToggleTheme={() => setIsDark(!isDark)} 
          isCollapsed={isSidebarCollapsed}
          sidebarWidth={sidebarWidth}
          isDragging={isDragging}
          onStartResize={() => setIsDragging(true)}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isMobile={isMobile}
          mobileTranslateX={mobileTranslateX}
          isDraggingMobile={isDraggingMobile}
        />
        
        {/* Mobile Header */}
        <div className="mobile-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo.png" alt="GeoLet Logo" style={{ width: "28px", height: "28px", borderRadius: "5px", objectFit: "contain" }} />
            <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.3px" }}>GeoLet</span>
          </div>
          <button className="hamburger-btn" onClick={() => setIsMobileSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Overlay for mobile */}
        {isMobileSidebarOpen && <div className="mobile-overlay" onClick={() => setIsMobileSidebarOpen(false)}></div>}

        {/* ChatGPT style toggle button when sidebar is closed */}
        {!isMobile && (
          <button 
            className="sidebar-open-btn"
            onClick={() => setIsSidebarCollapsed(false)}
            style={{
              position: "fixed",
              top: "24px",
              left: "24px",
              zIndex: 100,
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
              opacity: isSidebarCollapsed ? 1 : 0,
              pointerEvents: isSidebarCollapsed ? "auto" : "none",
              transform: isSidebarCollapsed ? "translateX(0)" : "translateX(-20px) scale(0.95)"
            }}
            title="Open Sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          </button>
        )}

        <main 
          className="main-content"
          style={{
            marginLeft: isMobile ? 0 : (isSidebarCollapsed ? 0 : sidebarWidth),
            transition: isDragging ? "none" : "margin-left 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)"
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/energy" element={<EnergyMonitor />} />
            <Route path="/news" element={<NewsCenter />} />
            <Route path="/country/:id" element={<CountryDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
