from fastapi import APIRouter, UploadFile, File, Depends
from core.security import verify_api_key
from services.vision_service import analyze_archaeological_image

router = APIRouter(dependencies=[Depends(verify_api_key)])

@router.post("/analyze/")
async def analyze_image(image: UploadFile = File(...)):
    image_bytes = await image.read()
    
    # 1. Analizar imagen y obtener historia
    description = analyze_archaeological_image(image_bytes)
    
    return {
        "status": "success",
        "data": {
            "description": description,
            "type": "visual_guide"
        }
    }