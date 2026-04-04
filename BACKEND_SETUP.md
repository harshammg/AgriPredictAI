# AgriPredict AI: Backend Implementation Guide

To make your dashboard and AI tools fully operational, you need a **FastAPI** backend that provides the following 6 endpoints.

## 1. Setup Your FastAPI Project
Create a new directory (e.g., `agripredict-backend`) and install dependencies:
```bash
pip install fastapi uvicorn motor pydantic-settings python-multipart python-jose[cryptography] passlib[bcrypt]
```

## 2. Required API Endpoints
Your backend must implement these exact routes (consistent with the frontend's `src/config/api.ts`):

### 🛡️ Authentication
*   **`POST /auth/register`**: Accepts `{ name, email, password, district, state }`. Hashes password and saves to MongoDB.
*   **`POST /auth/login`**: Accepts `{ email, password }`. Returns a JWT token and user info.

### 📊 Dashboard Data
*   **`GET /dashboard`**: Requires JWT header. Returns:
    ```json
    {
      "stats": [ { "label": "Avg Yield", "value": "2.4t", "sub": "+12% vs last year" }, ... ],
      "yieldData": [ { "month": "Jan", "yield": 400 }, ... ],
      "weekWeather": [ { "day": "Mon", "temp": 32, "icon": "Sun" }, ... ],
      "alerts": [ { "type": "warning", "msg": "Heavy rain forecast for Tuesday" }, ... ]
    }
    ```

### 🧠 AI Tools
*   **`POST /predict-yield`**: Accepts farm details (State, Crop, Area, NPK). Uses a trained model (Random Forest/XGBoost) to return `{ yield_kg_per_acre, profit_inr, confidence, recommendations }`.
*   **`POST /detect-disease`**: Accepts an image file and crop type. Uses a CNN model (ResNet/EfficientNet) to return `{ disease, confidence, severity, description, organic_treatment, chemical_treatment }`.
*   **`POST /recommend-crop`**: (Future) Accepts soil data to suggest the best crop for the season.

## 3. Environment Configuration
When the backend is live, update your **`.env`** file in the frontend with the real URL:
```env
VITE_API_URL=https://your-backend-service-url.a.run.app
```

## 4. Connecting to Your Real Data
The frontend is already coded to:
1.  Try fetching from `VITE_API_URL`.
2.  If it succeeds, your dashboard will show **real data**.
3.  If it fails (or is offline), it gracefully falls back to **Demo Mode**.

### 💡 Tip for Smooth Integration:
Ensure your FastAPI app has **CORS** enabled for the frontend domain:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this to your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)
```
