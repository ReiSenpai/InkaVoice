from fastapi import FastAPI
from api.routes_voice import router as voice_router
from api.routes_vision import router as vision_router

app = FastAPI(
    title="InkaVoice AI Service", 
    description="Microservicio estructurado de IA para InkaVoice",
    version="2.0"
)

# Mapeo de Controladores
app.include_router(voice_router, prefix="/api/ai", tags=["Voice Integration"])
app.include_router(vision_router, prefix="/api/ai", tags=["Vision AR Integration"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)