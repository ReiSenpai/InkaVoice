from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
# from core.security import verify_api_key  <-- Puedes comentar o borrar esta línea si quieres
#router = APIRouter(dependencies=[Depends(verify_api_key)])
# ELIMINAMOS LA DEPENDENCIA DE SEGURIDAD TEMPORALMENTE
router = APIRouter() 

@router.post("/analyze/")
async def analyze_image(
    image: UploadFile = File(...),
    language: str = Form("es") # Recibe el idioma como parte del formulario
):
    try:
        image_bytes = await image.read()
        
        if not image_bytes:
            raise HTTPException(status_code=400, detail="No se recibió la imagen.")
            
        # Pasamos el idioma al servicio
        description = analyze_archaeological_image(image_bytes, language)
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "data": {
                    "description": description,
                    "language": language,
                    "type": "visual_guide"
                }
            }
        )
    except Exception as e:
        print(f"Error en analyze_image: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno al analizar la imagen.")