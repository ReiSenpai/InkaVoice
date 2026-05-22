from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
from fastapi.responses import Response
from core.security import verify_jwt
from services.vision_service import analyze_image
from services.tts_service import synthesize_speech

router = APIRouter()

@router.post("/vision")
async def process_vision(
    image_file: UploadFile = File(...),
    output_language: str = Form("es"),
    # user_id: str = Depends(verify_jwt) # Descomentar para producción
):
    try:
        image_bytes = await image_file.read()
        description_text = await analyze_image(image_bytes, output_language)
        audio_response_bytes = await synthesize_speech(description_text, output_language)
        
        headers = {"X-Response-Text": description_text.encode('latin1', 'ignore').decode('latin1')}
        return Response(content=audio_response_bytes, media_type="audio/flac", headers=headers)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))