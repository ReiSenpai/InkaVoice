from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
from fastapi.responses import Response
from core.security import verify_jwt
from services.asr_service import recognize_speech
from services.translation_service import generate_tourist_response
from services.tts_service import synthesize_speech

router = APIRouter()

@router.post("/voice")
async def process_voice(
    audio_file: UploadFile = File(...),
    input_language: str = Form("es"),
    output_language: str = Form("es"),
    # user_id: str = Depends(verify_jwt) # Descomentar para producción
):
    try:
        audio_bytes = await audio_file.read()
        
        # 1. Escuchar al turista
        transcription = await recognize_speech(audio_bytes, input_language)
        if not transcription:
            raise HTTPException(status_code=400, detail="No se detectó voz.")
            
        # 2. Generar respuesta histórica (LLM)
        llm_answer = await generate_tourist_response(transcription, output_language)
        
        # 3. Hablar la respuesta
        audio_response_bytes = await synthesize_speech(llm_answer, output_language)
        
        headers = {"X-Response-Text": llm_answer.encode('latin1', 'ignore').decode('latin1')}
        return Response(content=audio_response_bytes, media_type="audio/flac", headers=headers)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))