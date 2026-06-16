export const shippingRoutes = [];

try {
  const response = await fetch("http://localhost:8000/api/shipping-routes");
  if (response.ok) {
    const data = await response.json();
    shippingRoutes.push(...data);
  }
} catch (error) {
  console.error("Failed to fetch shipping routes from python backend:", error);
}
