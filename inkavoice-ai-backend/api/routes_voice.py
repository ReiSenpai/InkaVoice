from fastapi import APIRouter, UploadFile, File, Form, Depends
from fastapi.responses import Response
from core.security import verify_api_key
from services.asr_service import transcribe_audio
from services.translation_service import generate_tourist_response
from services.tts_service import synthesize_speech
from fastapi import APIRouter, Form, Response

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
    
    return Response(content=audio_output, media_type="audio/flac")
# Añadir a routes_voice.py
@router.post("/process_text/")
async def process_text(text: str = Form(...), language: str = Form("es")):
    # 1. Pensar (Usar la lógica del LLM Turístico directamente sin pasar por Audio)
    tourist_response = generate_tourist_response(text, language)
    
    # 2. Hablar (Convertir el texto en Voz)
    audio_output = synthesize_speech(tourist_response, language)
    
    # Devuelve el audio para que se escuche, justo como en process_voice
    return Response(content=audio_output, media_type="audio/flac")


# (Tus otras rutas process_voice y process_text van aquí)

@router.post("/tts/")
async def text_to_speech_only(text: str = Form(...), language: str = Form("es")):
    """
    Recibe un texto puro y un idioma (es, en, qu) 
    y devuelve directamente el archivo de audio.
    """
    try:
        # Llamas a tu servicio para convertir el texto en audio con el idioma seleccionado
        audio_output = synthesize_speech(text, language)
        
        # Devuelves el audio a la web
        return Response(content=audio_output, media_type="audio/flac")
    except Exception as e:
        return {"error": str(e)}