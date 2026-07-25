from fastapi import APIRouter, UploadFile, File, Form, Depends
from core.security import verify_api_key
from services.vision_service import analyze_archaeological_image

router = APIRouter(dependencies=[Depends(verify_api_key)])

@router.post("/analyze/")
async def analyze_image(
    image: UploadFile = File(...),
    language: str = Form("es") # Recibe el idioma como parte del formulario
):
    image_bytes = await image.read()
    
    # Pasamos el idioma al servicio
    description = analyze_archaeological_image(image_bytes, language)
    
    return {
        "status": "success",
        "data": {
            "description": description,
            "language": language,
            "type": "visual_guide"
        }
    }