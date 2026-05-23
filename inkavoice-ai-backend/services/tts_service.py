from elevenlabs import ElevenLabs
from core.config import ELEVENLABS_API_KEY

client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

def synthesize_speech(text: str, language: str) -> bytes:
    audio = client.text_to_speech.convert(
        voice_id="JBFqnCBsd6RMkjVDRZzb",  # voz George (neutral, gratis)
        text=text,
        model_id="eleven_multilingual_v2"
    )
    return b"".join(audio)