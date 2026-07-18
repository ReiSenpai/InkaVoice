package backend.inkavoice.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/asistente")
public class AiProxyController {

    @Value("${inkavoice.ai.backend.url}")
    private String aiBackendUrl;

    @PostMapping("/voz")
    public ResponseEntity<?> procesarVoz(@RequestBody Map<String, Object> requestBody, @RequestHeader("Authorization") String authHeader) {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        // Opcional: Pasar el token al backend de IA si este también lo valida
        headers.set("Authorization", authHeader); 
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        
        try {
            String urlDestino = aiBackendUrl + "/api/voice/process";
            ResponseEntity<String> response = restTemplate.postForEntity(urlDestino, requestEntity, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al comunicarse con el servidor de IA"));
        }
    }
}
