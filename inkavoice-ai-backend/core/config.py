import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# Cargar las variables desde el archivo .env
load_dotenv()

# Obtener las variables usando los nombres exactos de tu .env
HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL", "http://localhost:8080/api/v1")

# Validar que el token exista para evitar errores al arrancar
if not HF_TOKEN:
    raise ValueError("No se encontró HUGGINGFACE_TOKEN en el archivo .env")

# Cliente general para interactuar con Hugging Face
hf_client = InferenceClient(token=HF_TOKEN)

# Modelos definidos para el proyecto
MODELS = {
    "asr_quechua": "facebook/mms-1b-all",
    "asr_general": "openai/whisper-small",
    "tts_quechua": "facebook/mms-tts-que",
    "tts_spanish": "myshell-ai/MeloTTS-Spanish",
    "llm_chat": "mistralai/Mixtral-8x7B-Instruct-v0.1",
    "vision_model": "llava-hf/llava-1.5-7b-hf"
}