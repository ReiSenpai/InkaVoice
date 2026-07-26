package backend.inkavoice.controller;

import backend.inkavoice.entity.Usuario;
import backend.inkavoice.entity.UsuarioXP;
import backend.inkavoice.repository.UsuarioRepository;
import backend.inkavoice.repository.UsuarioXPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = "*")
public class PerfilController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioXPRepository usuarioXPRepository;

    @GetMapping("/{usuarioId}")
    public ResponseEntity<?> obtenerPerfil(@PathVariable Long usuarioId) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
        
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = usuarioOpt.get();
        UsuarioXP xp = usuarioXPRepository.findByUsuarioId(usuarioId);

        // Armamos un DTO rápido mediante un Map
        Map<String, Object> perfil = new HashMap<>();
        perfil.put("id", usuario.getId());
        perfil.put("nombre", usuario.getNombre());
        perfil.put("email", usuario.getEmail());
        
        if (xp != null) {
            perfil.put("nivel", xp.getNivelActual());
            perfil.put("xp", xp.getXpTotal());
            perfil.put("rango", xp.getRango());
        }

        return ResponseEntity.ok(perfil);
    }
}