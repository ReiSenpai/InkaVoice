import base64
from fastapi import APIRouter, UploadFile, File, Form, Depends
from core.security import verify_api_key
from services.asr_service import transcribe_audio
from services.translation_service import generate_tourist_response
from services.tts_service import synthesize_speech

# Inyectamos la seguridad en todo el router
router = APIRouter(dependencies=[Depends(verify_api_key)])

@router.post("/process/")
async def process_voice(audio: UploadFile = File(...), language: str = Form("es")):
    audio_bytes = await audio.read()
    
    # 1. Escuchar (Voz a Texto)
    user_text = transcribe_audio(audio_bytes, language)
    
    # 2. Pensar (Lógica LLM Turística)
    tourist_response = generate_tourist_response(user_text, language)
    
    # 3. Hablar (Texto a Voz)
    audio_output = synthesize_speech(tourist_response, language)
    
    # 4. Convertir el audio binario a Base64 para enviarlo de forma segura
    audio_base64 = base64.b64encode(audio_output).decode('utf-8')
    
    # Retornamos un JSON estructurado
    return {
        "status": "success",
        "texto_usuario": user_text,          # Lo que el usuario dijo
        "resultado_texto": tourist_response, # Lo que la IA responde en texto
        "audio_base64": audio_base64         # El audio para reproducir en la app
    }

@router.post("/process_text/")
async def process_text(text: str = Form(...), language: str = Form("es")):
    # 1. Pensar (Usar la lógica del LLM Turístico directamente)
    tourist_response = generate_tourist_response(text, language)
    
    # 2. Hablar (Convertir el texto en Voz)
    audio_output = synthesize_speech(tourist_response, language)
    
    # Convertir a Base64
    audio_base64 = base64.b64encode(audio_output).decode('utf-8')
    
    return {
        "status": "success",
        "resultado_texto": tourist_response,
        "audio_base64": audio_base64
    }

@router.post("/tts/")
async def text_to_speech_only(text: str = Form(...), language: str = Form("es")):
    try:
        audio_output = synthesize_speech(text, language)
        audio_base64 = base64.b64encode(audio_output).decode('utf-8')
        
        return {
            "status": "success",
            "audio_base64": audio_base64
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}