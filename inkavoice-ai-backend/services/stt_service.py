from huggingface_hub import InferenceClient
from core.config import HF_TOKEN

client = InferenceClient(token=HF_TOKEN)

def transcribir_audio(audio_bytes: bytes, idioma: str = "es") -> str:
    modelo = "facebook/mms-1b-all" if idioma == "qu" else "openai/whisper-large-v3"
    try:
        # Usamos el método nativo automatic_speech_recognition
        resultado = client.automatic_speech_recognition(model=modelo, audio=audio_bytes)
        return resultado.text
    except Exception as e:
        return f"Error STT: {e}"