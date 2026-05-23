from core.config import hf_client, MODELS

def synthesize_speech(text: str, language: str) -> bytes:
    """Convierte el texto generado a un archivo de audio (flac/wav)."""
    model_id = MODELS["tts_quechua"] if language == "qu" else MODELS["tts_spanish"]
    
    audio_bytes = hf_client.text_to_speech(
        text,
        model=model_id
    )
    return audio_bytes