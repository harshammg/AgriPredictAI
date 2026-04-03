const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API = {
  predictYield: `${BASE}/predict-yield`,
  detectDisease: `${BASE}/detect-disease`,
  recommendCrop: `${BASE}/recommend-crop`,
  dashboard: `${BASE}/dashboard`,
  register: `${BASE}/auth/register`,
  login: `${BASE}/auth/login`,
};
