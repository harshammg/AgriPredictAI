const BASE = import.meta.env.VITE_API_URL;
if (!BASE) console.warn("VITE_API_URL is NOT set. Frontend will not be able to connect to the backend.");

export const API = {
  predictYield: `${BASE}/predict-yield`,
  detectDisease: `${BASE}/detect-disease`,
  recommendCrop: `${BASE}/recommend-crop`,
  dashboard: `${BASE}/dashboard`,
  register: `${BASE}/auth/register`,
  login: `${BASE}/auth/login`,
};
