import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    HF_API_KEY = os.getenv("HF_API_KEY")
    JWT_SECRET = os.getenv("SPRING_BOOT_SECRET", "secret_por_defecto")
    
    # Modelos de Hugging Face
    ASR_WHISPER_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3"
    ASR_MMS_QUE_URL = "https://api-inference.huggingface.co/models/facebook/mms-1b-all"
    TTS_MELO_ES_URL = "https://api-inference.huggingface.co/models/myshell-ai/MeloTTS-Spanish"
    TTS_MMS_QUE_URL = "https://api-inference.huggingface.co/models/facebook/mms-tts-que"
    VISION_API_URL = "https://api-inference.huggingface.co/models/llava-hf/llava-1.5-7b-hf"
    LLM_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"

settings = Settings()