import { useEffect, useRef, useState } from "react";

export default function StatCard({ label, value, sub, accentColor, icon, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const isNumeric = !isNaN(numericValue) && numericValue > 0;
  const ref = useRef(null);

  useEffect(() => {
    if (!isNumeric) return;
    const duration = 800;
    const steps = 40;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayed(numericValue);
        clearInterval(timer);
      } else {
        setDisplayed(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [numericValue, isNumeric]);

  const displayValue = isNumeric
    ? String(value).includes(".")
      ? displayed.toFixed(1)
      : Math.round(displayed)
    : value;

  return (
    <div
      ref={ref}
      className="stat-card animate-fadeInUp"
      style={{
        "--accent-color": accentColor || "var(--accent-blue)",
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      <div className="stat-card-header">
        <div className="stat-card-label">{label}</div>
        {icon && (
          <div
            className="stat-card-icon"
            style={{
              background: accentColor ? `${accentColor}18` : "var(--accent-blue-dim)",
              color: accentColor || "var(--accent-blue)",
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="stat-card-value">{displayValue}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}
