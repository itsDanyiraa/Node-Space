export const STORAGE_KEY = "nodespace_data";

export function saveCanvas(data: { nodes: any[]; edges: any[] }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadCanvas(): { nodes: any[]; edges: any[] } {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return { nodes: [], edges: [] };
}
