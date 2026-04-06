const API_BASE = "http://localhost:3000/api";

async function fetchAPI(endpoint) {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`);
    return await res.json();
  } catch (error) {
    console.error("Erro API:", error);
    return [];
  }
}
