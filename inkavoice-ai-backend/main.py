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
# Esto permite que tu archivo HTML o tu Spring Boot puedan conectarse a la API sin ser bloqueados
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite conexiones desde cualquier origen
    allow_credentials=False, # <-- CORREGIDO: Debe ser False para que no colapse con allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)
# -----------------------------

# Conectar las rutas modulares al servidor principal
app.include_router(voice_router, prefix="/api/v1/voice", tags=["Voice Assistant"])
app.include_router(vision_router, prefix="/api/v1/vision", tags=["Visual Guide"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "InkaVoice AI Backend operando correctamente"}

# Para ejecutar localmente (python main.py)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)