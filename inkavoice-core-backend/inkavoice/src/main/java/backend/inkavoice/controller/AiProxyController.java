package backend.inkavoice.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/asistente")
public class AiProxyController {

    @Value("${inkavoice.ai.backend.url}")
    private String aiBackendUrl;

    // --- ENDPOINT CORREGIDO PARA VOZ ---
    @PostMapping(value = "/voz", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> procesarVoz(
            @RequestParam("audio") MultipartFile audio,
            @RequestParam("language") String language,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        if (authHeader != null) {
            headers.set("Authorization", authHeader);
        }
        
        // Construimos el cuerpo multipart para enviar a Python
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("language", language);
        body.add("audio", audio.getResource()); // Enviamos el archivo de audio
        
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        try {
            String urlDestino = aiBackendUrl + "/api/voice/process";
            ResponseEntity<String> response = restTemplate.postForEntity(urlDestino, requestEntity, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al comunicarse con el servidor de IA"));
        }
    }

    // --- TU ENDPOINT DE VISIÓN (INTACTO Y CORRECTO) ---
    @PostMapping(value = "/vision", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> procesarVision(
            @RequestParam("image") MultipartFile image,
            @RequestParam("language") String language,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        if (authHeader != null) {
            headers.set("Authorization", authHeader);
        }
        
        // Construimos el cuerpo multipart para enviar a Python
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("language", language);
        body.add("image", image.getResource()); 
        
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        try {
            // Asegúrate de que la ruta coincida con el @PostMapping de routes_vision.py
            String urlDestino = aiBackendUrl + "/api/vision/analyze/"; 
            ResponseEntity<String> response = restTemplate.postForEntity(urlDestino, requestEntity, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al comunicarse con el servidor de IA"));
        }
    }
}