import { useState, useEffect } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import { ExternalLink, Clock, Radio } from "lucide-react";

export default function NewsCenter() {
  useScrollReveal();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch news data:", err);
        setLoading(false);
      });
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours === 0) return "Just now";
    if (diffInHours === 1) return "1 hr ago";
    if (diffInHours < 24) return `${diffInHours} hrs ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="dashboard-content" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="page-header reveal-left">
        <div>
          <h1 className="page-title">News Center</h1>
          <p className="page-subtitle">Curated intelligence feeds and geopolitical event tracking.</p>
        </div>
      </div>

      <div>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
            <div style={{ animation: "pulse 2s infinite", opacity: 0.6 }}>Fetching Intelligence Feeds...</div>
          </div>
        ) : news ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {news.articles.map((article, index) => (
              <div 
                key={article.id || index} 
                className="panel card-business reveal-up" 
                style={{ 
                  padding: "24px", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "16px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }}
                onClick={() => article.url && window.open(article.url, "_blank")}
              >
                {/* Card Header: Source and Severity */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                    <Radio size={14} />
                    <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                      {article.source}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: "10px", 
                    padding: "4px 8px", 
                    borderRadius: "4px", 
                    background: article.severity === "high" ? "var(--severity-critical)" : article.severity === "medium" ? "var(--severity-high)" : "var(--bg-elevated)",
                    color: article.severity === "low" ? "var(--text-primary)" : "#fff",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.05em"
                  }}>
                    {article.severity}
                  </span>
                </div>

                {/* Article Title */}
                <h3 style={{ 
                  color: "var(--text-primary)", 
                  fontSize: "18px", 
                  margin: 0,
                  lineHeight: 1.4,
                  fontWeight: 600,
                  flexGrow: 1
                }}>
                  {article.title}
                </h3>

                {/* Card Footer: Time and Link */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginTop: "8px",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border-subtle)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "12px" }}>
                    <Clock size={14} />
                    <span>{formatTimeAgo(article.timestamp)}</span>
                  </div>
                  
                  {article.url && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--accent-blue)", fontSize: "13px", fontWeight: 600 }}>
                      Read <ExternalLink size={14} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Failed to load news. Please check your connection or API configuration.</p>
          </div>
        )}
      </div>
    </div>
  );
}
