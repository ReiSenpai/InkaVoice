from groq import Groq
from core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def transcribe_audio(audio_bytes: bytes, language: str) -> str:
    transcription = client.audio.transcriptions.create(
        file=("audio.wav", audio_bytes),
        model="whisper-large-v3-turbo",
        language="es" if language != "qu" else None,
        response_format="text"
    )
    return transcription