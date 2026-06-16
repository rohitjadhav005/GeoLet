export const conflicts = [];
export const conflictsByCountry = {};
export let activeConflictCount = 0;
export let totalOilAffected = "0.0";
export const totalPeopleInNeed = "120+ million";

try {
  const response = await fetch("http://localhost:8000/api/conflicts");
  if (response.ok) {
    const data = await response.json();
    conflicts.push(...data);
    Object.assign(conflictsByCountry, Object.fromEntries(conflicts.map((c) => [c.id, c])));
    activeConflictCount = conflicts.filter((c) => c.status.startsWith("Active")).length;
    totalOilAffected = conflicts.reduce((sum, c) => sum + (c.oilExportAffected || 0), 0).toFixed(1);
  }
} catch (error) {
  console.error("Failed to fetch conflicts data from python backend:", error);
}
