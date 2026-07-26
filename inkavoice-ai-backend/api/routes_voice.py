import base64
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import Response, JSONResponse
from core.security import verify_api_key
from services.asr_service import transcribe_audio
from services.translation_service import generate_tourist_response
from services.tts_service import synthesize_speech

# Inyectamos la seguridad en todo el router
#router = APIRouter(dependencies=[Depends(verify_api_key)])
# Cámbiala por esta: temporal
router = APIRouter()

@router.post("/process/")
async def process_voice(audio: UploadFile = File(...), language: str = Form("es")):
    try:
        audio_bytes = await audio.read()
        
        # 1. Escuchar (Voz a Texto)
        user_text = transcribe_audio(audio_bytes, language)
        
        # 2. Pensar (Lógica LLM Turística)
        tourist_response = generate_tourist_response(user_text, language)
        
        # 3. Hablar (Texto a Voz)
        audio_output = synthesize_speech(tourist_response, language)
        
        # 4. Convertir el audio binario a Base64 para enviarlo dentro del JSON
        audio_base64 = base64.b64encode(audio_output).decode('utf-8')
        
        # Retornamos un JSON estructurado
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "texto_usuario": user_text,          # Lo que el usuario dijo
                "resultado_texto": tourist_response, # Lo que la IA responde en texto
                "audio_base64": audio_base64         # El audio para reproducir en la app
            }
        )
    except Exception as e:
        print(f"Error en process_voice: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al procesar la voz.")

@router.post("/process_text/")
async def process_text(text: str = Form(...), language: str = Form("es")):
    try:
        # 1. Pensar (Usar la lógica del LLM Turístico directamente)
        tourist_response = generate_tourist_response(text, language)
        
        # 2. Hablar (Convertir el texto en Voz)
        audio_output = synthesize_speech(tourist_response, language)
        
        # Convertir a Base64
        audio_base64 = base64.b64encode(audio_output).decode('utf-8')
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "resultado_texto": tourist_response,
                "audio_base64": audio_base64
            }
        )
    except Exception as e:
        print(f"Error en process_text: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al procesar el texto.")

# --- CORREGIDO: Retorna Binario Directo para Spring Boot ---
@router.post("/tts/")
async def text_to_speech_only(text: str = Form(...), language: str = Form("es")):
    try:
        if not text:
            raise HTTPException(status_code=400, detail="El texto está vacío.")

        # Genera el audio en bytes
        audio_output = synthesize_speech(text, language)
        
        # Retornamos directamente los bytes como archivo de audio
        return Response(
            content=audio_output,
            media_type="audio/wav" # Cambiar a audio/mpeg si tu TTS genera MP3
        )
    except Exception as e:
        print(f"Error en text_to_speech_only: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al generar el TTS.")