from core.config import hf_client, MODELS

def transcribe_audio(audio_bytes: bytes, language: str) -> str:
    """Convierte el audio del usuario a texto dependiendo del idioma."""
    model_id = MODELS["asr_quechua"] if language == "qu" else MODELS["asr_general"]
    
    response = hf_client.automatic_speech_recognition(
        audio=audio_bytes,
        model=model_id
    )
    return response.text