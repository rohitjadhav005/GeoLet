import os

file_path = r"c:\Users\rohii\OneDrive\Desktop\GeoLet\src\index.css"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Locate and remove the old RESPONSIVE section starting around line 1325
# To make it robust, we will find the block by headers.
# The old block is:
# /* ============================================================
#    RESPONSIVE
# ============================================================ */
# all the way up to:
# /* ============================================================
#    HERO SLIDER

old_header = "/* ============================================================\n   RESPONSIVE\n============================================================ */"
hero_slider_header = "/* ============================================================\n   HERO SLIDER\n============================================================ */"

if old_header in content and hero_slider_header in content:
    idx_start = content.index(old_header)
    idx_end = content.index(hero_slider_header)
    # Remove old responsive section
    content = content[:idx_start] + content[idx_end:]
    print("Removed old RESPONSIVE section successfully.")
else:
    print("WARNING: Could not locate old RESPONSIVE section by header names.")

# 2. Locate and replace the second RESPONSIVE DESIGN section
# It starts with:
# /* ============================================================
#    RESPONSIVE DESIGN (MOBILE & TABLET)
# ============================================================ */
# and ends with:
# /* ============================================================
#    ROUTES LIST LAYOUT (Replaces Table)

second_header = "/* ============================================================\n   RESPONSIVE DESIGN (MOBILE & TABLET)\n============================================================ */"
routes_layout_header = "/* ============================================================\n   ROUTES LIST LAYOUT (Replaces Table)\n============================================================ */"

new_responsive_block = """/* ============================================================
   RESPONSIVE DESIGN (MOBILE & TABLET)
============================================================ */

/* Mobile Header Elements */
.mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--sidebar-bg);
  border-bottom: 1px solid var(--sidebar-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.hamburger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
}

/* Mobile Overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 150;
  backdrop-filter: blur(3px);
}

/* 1280px Desktop / Laptop Layout Changes */
@media (max-width: 1280px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .bottom-panels {
    grid-template-columns: 1fr;
  }
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .detail-hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .conflict-overview-grid {
    grid-template-columns: 1fr;
  }
  .humanitarian-grid {
    grid-template-columns: 1fr;
  }
}

/* 900px Tablet Views */
@media (max-width: 900px) {
  .sidebar {
    width: 220px;
  }
  .main-content {
    margin-left: 220px;
  }
  .routes-grid {
    grid-template-columns: 1fr;
  }
  .deficiency-grid {
    grid-template-columns: 1fr;
  }
  .displaced-stats {
    grid-template-columns: 1fr;
  }
  .detail-sections {
    padding: 24px 20px;
  }
  .detail-hero {
    padding: 24px 20px;
  }
  .detail-anchor-nav {
    padding: 0 20px;
  }
}

/* 768px Mobile & Small Tablet Views */
@media (max-width: 768px) {
  .app-shell {
    flex-direction: column;
  }

  .mobile-header {
    display: flex;
  }

  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 300;
    width: 260px;
  }

  .mobile-sidebar-open .sidebar {
    transform: translateX(0);
  }

  .mobile-sidebar-open .mobile-overlay {
    display: block;
  }

  .main-content {
    margin-left: 0 !important;
  }

  .dashboard-content {
    padding: 16px;
    gap: 16px;
  }

  .page-header {
    padding: 16px 16px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 0;
    gap: 10px;
  }

  .map-section, .bottom-panels {
    padding: 0;
  }

  .map-section {
    height: 380px;
  }

  .panel-body {
    padding: 16px;
  }

  .detail-hero {
    padding: 24px 20px;
  }

  .detail-hero-stats {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .detail-hero-meta > div {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .detail-country-name {
    font-size: 28px;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-anchor-nav {
    overflow-x: auto;
    white-space: nowrap;
    justify-content: flex-start;
    padding-bottom: 8px;
  }

  .bottom-panels {
    grid-template-columns: 1fr;
  }

  .hide-on-mobile {
    display: none !important;
  }
  
  .route-row {
    flex-direction: column;
    gap: 12px;
    padding: 16px 0;
  }
  
  .r-col {
    width: 100% !important;
    padding-right: 0 !important;
  }
  
  .mobile-label {
    display: block !important;
  }
}

/* 480px Mobile Portrait Views */
@media (max-width: 480px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .chart-tabs {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    justify-content: flex-start;
    padding-bottom: 4px;
  }

  .dashboard-content {
    padding: 12px;
    gap: 12px;
  }

  .page-header {
    padding: 12px 12px 0;
  }
}

"""

if second_header in content and routes_layout_header in content:
    idx_start = content.index(second_header)
    idx_end = content.index(routes_layout_header)
    content = content[:idx_start] + new_responsive_block + content[idx_end:]
    print("Replaced second responsive block successfully.")
else:
    print("WARNING: Could not locate second responsive block by header names.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Finished processing index.css.")
