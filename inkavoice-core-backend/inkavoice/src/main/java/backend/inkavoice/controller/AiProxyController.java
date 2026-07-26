package backend.inkavoice.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/asistente")
@CrossOrigin(origins = "*") // Vital para que React Native/Expo pueda comunicarse sin bloqueos CORS
public class AiProxyController {

    @Value("${inkavoice.ai.backend.url}")
    private String aiBackendUrl;

    // --- ENDPOINT PARA PROCESAMIENTO DE VOZ (SPEECH-TO-TEXT) ---
    @PostMapping(value = "/voz", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> procesarVoz(
            @RequestParam("audio") MultipartFile audio,
            @RequestParam(value = "language", defaultValue = "es") String language,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            if (authHeader != null) {
                headers.set("Authorization", authHeader);
            }
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("language", language);
            
            // Empaquetado seguro para evitar que Python rechace el archivo
            body.add("audio", new ByteArrayResource(audio.getBytes()) {
                @Override
                public String getFilename() {
                    return audio.getOriginalFilename() != null ? audio.getOriginalFilename() : "audio.wav";
                }
            });
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            String urlDestino = aiBackendUrl + "/api/v1/voice/process/";
            ResponseEntity<String> response = restTemplate.postForEntity(urlDestino, requestEntity, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al leer el archivo de audio."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al comunicarse con el servidor de IA de Voz."));
        }
    }

    // --- ENDPOINT PARA VISIÓN AR (IMAGEN-A-TEXTO) ---
    @PostMapping(value = "/vision", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> procesarVision(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "language", defaultValue = "es") String language,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            if (authHeader != null) {
                headers.set("Authorization", authHeader);
            }
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("language", language);
            
            // Empaquetado seguro para asegurar el atributo filename
            body.add("image", new ByteArrayResource(image.getBytes()) {
                @Override
                public String getFilename() {
                    return image.getOriginalFilename() != null ? image.getOriginalFilename() : "capture.jpg";
                }
            }); 
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            String urlDestino = aiBackendUrl + "/api/v1/vision/analyze/"; 
            ResponseEntity<String> response = restTemplate.postForEntity(urlDestino, requestEntity, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al leer el archivo de imagen."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al comunicarse con el servidor de IA de Visión."));
        }
    }

    // --- ENDPOINT PARA TEXT-TO-SPEECH (AUDIOGUÍA) ---
    @PostMapping(value = "/tts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> textToSpeech(
            @RequestParam("text") String text,
            @RequestParam(value = "language", defaultValue = "es") String language,
            @RequestHeader(value = "Authorization", required = false) String authHeader) { 
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            if (authHeader != null) {
                headers.set("Authorization", authHeader);
            }
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("text", text);
            body.add("language", language);
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            String urlDestino = aiBackendUrl + "/api/v1/voice/tts/";
            
            // NOTA: Cambiado a byte[].class para recibir el audio binario sin corromperlo
            ResponseEntity<byte[]> response = restTemplate.postForEntity(urlDestino, requestEntity, byte[].class);
            
            // Propagamos los headers de Python (ej: audio/wav o audio/mpeg) hacia el frontend
            HttpHeaders responseHeaders = new HttpHeaders();
            if (response.getHeaders().getContentType() != null) {
                responseHeaders.setContentType(response.getHeaders().getContentType());
            } else {
                responseHeaders.setContentType(MediaType.valueOf("audio/wav")); // Fallback seguro
            }
            
            return ResponseEntity.status(response.getStatusCode())
                    .headers(responseHeaders)
                    .body(response.getBody());
                    
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al comunicarse con el servidor de IA para TTS."));
        }
    }
}