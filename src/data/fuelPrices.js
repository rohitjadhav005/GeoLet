export const brentCrude = [];
export const wtiCrude = [];
export const naturalGas = [];
export const lng = [];
export const fuelSummary = {
  brentCrude: { label: "Brent Crude", current: 0, change: "0.0", unit: "USD/bbl", color: "var(--severity-high)" },
  wtiCrude: { label: "WTI Crude", current: 0, change: "0.0", unit: "USD/bbl", color: "var(--severity-medium)" },
  naturalGas: { label: "Natural Gas", current: 0, change: "0.0", unit: "USD/MMBtu", color: "var(--accent)" },
  lng: { label: "LNG (Asia)", current: 0, change: "0.0", unit: "USD/MMBtu", color: "var(--severity-low)" }
};

try {
  const response = await fetch("http://localhost:8000/api/fuel-prices");
  if (response.ok) {
    const data = await response.json();
    if (data.brentCrude) brentCrude.push(...data.brentCrude);
    if (data.wtiCrude) wtiCrude.push(...data.wtiCrude);
    if (data.naturalGas) naturalGas.push(...data.naturalGas);
    if (data.lng) lng.push(...data.lng);
    if (data.fuelSummary) Object.assign(fuelSummary, data.fuelSummary);
  }
} catch (error) {
  console.error("Failed to fetch fuel prices from python backend:", error);
}
