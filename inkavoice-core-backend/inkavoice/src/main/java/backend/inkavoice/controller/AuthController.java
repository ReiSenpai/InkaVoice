package backend.inkavoice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import backend.inkavoice.dto.AuthRequestDTO;
import backend.inkavoice.dto.AuthResponseDTO;
import backend.inkavoice.dto.GoogleTokenDTO;
import backend.inkavoice.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody AuthRequestDTO request) {
        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new AuthResponseDTO(null, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(new AuthResponseDTO(null, e.getMessage()));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponseDTO> googleLogin(@RequestBody GoogleTokenDTO googleToken) {
        try {
            return ResponseEntity.ok(authService.googleLogin(googleToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(new AuthResponseDTO(null, e.getMessage()));
        }
    }
}