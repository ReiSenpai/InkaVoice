import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL", "http://localhost:8080/api/v1")

if not HF_TOKEN:
    raise ValueError("No se encontró HUGGINGFACE_TOKEN en el archivo .env")
if not GROQ_API_KEY:
    raise ValueError("No se encontró GROQ_API_KEY en el archivo .env")
if not ELEVENLABS_API_KEY:
    raise ValueError("No se encontró ELEVENLABS_API_KEY en el archivo .env")

MODELS = {
    "asr_quechua":  "whisper-large-v3-turbo",
    "asr_general":  "whisper-large-v3-turbo",
    "tts_quechua":  "eleven_multilingual_v2",
    "tts_spanish":  "eleven_multilingual_v2",
    "llm_chat":     "llama-3.1-8b-instant",
    "vision_model": "google-vision"
}