from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.responses import Response
from core.security import verify_jwt
from services.asr_service import recognize_speech
from services.tts_service import synthesize_speech
from services.vision_service import analyze_image

app = FastAPI(
    title="InkaVoice AI Service", 
    description="Microservicio de IA para procesamiento de Voz y Visión AR en Machu Picchu",
    version="1.0"
)

@app.post("/api/v1/process-audio")
async def process_audio_endpoint(
    audio_file: UploadFile = File(...),
    input_language: str = Form("es"),   # Idioma en que habla el turista ('es', 'en', 'qu')
    output_language: str = Form("es"),  # Idioma en que quiere escuchar la respuesta
    #user_id: str = Depends(verify_jwt)  # Bloquea acceso si el JWT de Java no es válido
):
    try:
        audio_bytes = await audio_file.read()
        
        # 1. Convertir voz a texto
        transcription = await recognize_speech(audio_bytes, input_language)
        if not transcription:
            raise HTTPException(status_code=400, detail="No se detectó voz clara.")
            
        # 2. Aquí iría la lógica del LLM Histórico (Mockeado para la estructura)
        # Se asume que el LLM genera y traduce la respuesta arqueológica
        llm_answer = f"Respuesta histórica sobre: {transcription}"
        
        # 3. Convertir respuesta texto a voz (Audio)
        audio_response_bytes = await synthesize_speech(llm_answer, output_language)
        
        # 4. Devolver audio y adjuntar el texto en los Headers (por si la app quiere mostrar subtítulos)
        headers = {"X-Response-Text": llm_answer.encode('latin1', 'ignore').decode('latin1')}
        return Response(content=audio_response_bytes, media_type="audio/flac", headers=headers)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/process-image")
async def process_image_endpoint(
    image_file: UploadFile = File(...),
    output_language: str = Form("es"),
    #user_id: str = Depends(verify_jwt)
):
    try:
        image_bytes = await image_file.read()
        
        # 1. Analizar estructura (Visión AR)
        description_text = await analyze_image(image_bytes, output_language)
        
        # 2. Narrar la descripción (TTS)
        audio_response_bytes = await synthesize_speech(description_text, output_language)
        
        # 3. Retornar
        headers = {"X-Response-Text": description_text.encode('latin1', 'ignore').decode('latin1')}
        return Response(content=audio_response_bytes, media_type="audio/flac", headers=headers)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)