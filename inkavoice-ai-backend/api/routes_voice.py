from fastapi import APIRouter, UploadFile, File, Form, Depends
from fastapi.responses import Response
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
    
    return Response(content=audio_output, media_type="audio/flac")