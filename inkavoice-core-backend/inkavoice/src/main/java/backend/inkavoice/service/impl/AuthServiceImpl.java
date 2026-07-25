package backend.inkavoice.service.impl;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import backend.inkavoice.dto.AuthRequestDTO;
import backend.inkavoice.dto.AuthResponseDTO;
import backend.inkavoice.entity.Usuario;
import backend.inkavoice.service.AuthService;
import backend.inkavoice.repository.UsuarioRepository;
import backend.inkavoice.security.JwtService;
import backend.inkavoice.dto.GoogleTokenDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Value("${google.client.id}")
    private String googleClientId;

    @Override
    public AuthResponseDTO register(AuthRequestDTO request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        Usuario nuevo = new Usuario();
        nuevo.setNombre(request.getNombre());
        nuevo.setEmail(request.getEmail());
        nuevo.setPassword(passwordEncoder.encode(request.getPassword()));
        nuevo.setAuthProvider("LOCAL");
        
        usuarioRepository.save(nuevo);
        String jwtToken = jwtService.generateToken(nuevo.getEmail());
        
        return new AuthResponseDTO(jwtToken, "Registro exitoso");
    }

    @Override
    public AuthResponseDTO login(AuthRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));
        
        if (usuario.getPassword() == null || !passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        String jwtToken = jwtService.generateToken(usuario.getEmail());
        return new AuthResponseDTO(jwtToken, "Login exitoso");
    }

    @Override
    public AuthResponseDTO googleLogin(GoogleTokenDTO googleTokenDTO) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(googleTokenDTO.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                
                Usuario usuario = usuarioRepository.findByEmail(email).orElseGet(() -> {
                    Usuario nuevoUsuario = new Usuario();
                    nuevoUsuario.setEmail(email);
                    nuevoUsuario.setNombre((String) payload.get("name"));
                    nuevoUsuario.setAuthProvider("GOOGLE");
                    return usuarioRepository.save(nuevoUsuario);
                });

                String jwtToken = jwtService.generateToken(usuario.getEmail());
                return new AuthResponseDTO(jwtToken, "Autenticado con Google");
            } else {
                throw new RuntimeException("Token de Google inválido");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error verificando el token de Google: " + e.getMessage());
        }
    }
}
