# InkaVoice AI Backend

Guía de instalación y configuración para levantar el servidor backend del proyecto InkaVoice.

## 1. Clonar el repositorio

Primero, clona el repositorio en tu máquina local y entra al directorio del proyecto:

```bash
git clone <url-del-repo>
```
```bash
cd inkavoice-ai-backend
```

### 2. Instalar dependencias
Instala las librerías necesarias utilizando pip:

```bash
pip install fastapi uvicorn python-dotenv requests groq elevenlabs
```
### 3. Configurar las variables de entorno
Crea un archivo llamado .env en la raíz del proyecto y agrega las siguientes credenciales:

```bash
HUGGINGFACE_TOKEN=hf_xxx
GROQ_API_KEY=gsk_xxx
ELEVENLABS_API_KEY=sk_xxx
SPRING_BOOT_URL=http://localhost:8080/api/v1
INKAVOICE_API_KEY=llave-secreta-inkavoice-2026
```

### HACER INICIAR EL PYTHON
1. cd inkavoice-ai-backend
2. .\venv\Scripts\Activate.ps1 o pude ser: .\venv\Scripts\activate
3. pip install -r requirements.txt
4. python main.py     

por si no funciona:
4. pip install groq elevenlabs google-cloud-vision --break-system-packages
5. pip install groq elevenlabs google-cloud-vision    
6. python main.py           