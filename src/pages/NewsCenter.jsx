import { useState, useEffect } from "react";

export default function NewsCenter() {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/news")
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

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">News Center</h1>
          <p className="page-subtitle">Curated intelligence feeds and geopolitical event tracking.</p>
        </div>
      </div>
      <div style={{ padding: "40px 24px", color: "var(--text-muted)", textAlign: "center" }}>
        {loading ? (
          <p>Loading news feed from Python backend...</p>
        ) : news ? (
          <div style={{ textAlign: "left", display: "grid", gap: "16px" }}>
            {news.articles.map(article => (
              <div key={article.id} className="panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "bold" }}>{article.source}</span>
                  <span style={{ 
                    fontSize: "12px", 
                    padding: "2px 8px", 
                    borderRadius: "12px", 
                    background: article.severity === "high" ? "var(--color-negative)" : "var(--bg-elevated)",
                    color: article.severity === "high" ? "#fff" : "var(--text-primary)"
                  }}>
                    {article.severity} severity
                  </span>
                </div>
                <h3 style={{ color: "var(--text-primary)", fontSize: "18px", margin: 0 }}>{article.title}</h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(article.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>Failed to load news. Ensure the Python backend is running on port 8000.</p>
        )}
      </div>
    </div>
  );
}
