from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes_voice import router as voice_router
from api.routes_vision import router as vision_router

app = FastAPI(
    title="InkaVoice AI Backend",
    description="Microservicio de IA para asistencia turística en Machu Picchu",
    version="1.0.0"
)

# --- CONFIGURACIÓN DE CORS ---
# Esto permite que tu archivo HTML pueda conectarse a la API sin ser bloqueado
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite conexiones desde cualquier origen (ej. tu archivo HTML local)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -----------------------------

# Conectar las rutas modulares al servidor principal[cite: 1]
app.include_router(voice_router, prefix="/api/v1/voice", tags=["Voice Assistant"])
app.include_router(vision_router, prefix="/api/v1/vision", tags=["Visual Guide"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "InkaVoice AI Backend operando correctamente"}

# Para ejecutar localmente (python main.py)[cite: 1]
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)