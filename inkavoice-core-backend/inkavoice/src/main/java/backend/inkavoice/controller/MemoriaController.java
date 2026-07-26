package backend.inkavoice.controller;

import backend.inkavoice.entity.Memoria;
import backend.inkavoice.entity.Usuario;
import backend.inkavoice.entity.UsuarioXP;
import backend.inkavoice.repository.MemoriaRepository;
import backend.inkavoice.repository.UsuarioRepository;
import backend.inkavoice.repository.UsuarioXPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/memorias")
@CrossOrigin(origins = "*")
public class MemoriaController {

    @Autowired
    private MemoriaRepository memoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioXPRepository usuarioXPRepository;

    @PostMapping("/crear")
    public ResponseEntity<?> crearMemoria(@RequestBody Map<String, String> payload) {
        try {
            Long usuarioId = Long.parseLong(payload.get("usuarioId"));
            String lugarDetectado = payload.get("lugarDetectado"); // Ej: "Huaco Retrato Moche"
            String fotoUrl = payload.get("fotoUrl"); // La URL o base64 de la foto
            String descripcion = payload.get("descripcion"); // Lo que dijo la IA

            Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Usuario no encontrado"));
            }

            Usuario usuario = usuarioOpt.get();

            // 1. Guardar la nueva memoria (Historial)
            Memoria nuevaMemoria = new Memoria();
            nuevaMemoria.setUsuario(usuario);
            nuevaMemoria.setLugarDetectado(lugarDetectado);
            nuevaMemoria.setFotoUrl(fotoUrl);
            nuevaMemoria.setDescripcion(descripcion);
            memoriaRepository.save(nuevaMemoria);

            // 2. Sistema de Gamificación: Sumar Experiencia (XP)
            UsuarioXP xpInfo = usuarioXPRepository.findByUsuarioId(usuarioId);
            if (xpInfo == null) {
                // Si el usuario es nuevo y no tiene tabla de XP, se la creamos
                xpInfo = new UsuarioXP();
                xpInfo.setUsuario(usuario);
            }
            
            // Sumamos 50 XP por cada escaneo exitoso
            xpInfo.setXpTotal(xpInfo.getXpTotal() + 50);
            
            // Lógica simple de subida de nivel (cada 200 XP = 1 nivel)
            int nuevoNivel = (xpInfo.getXpTotal() / 200) + 1;
            if (nuevoNivel > xpInfo.getNivelActual()) {
                xpInfo.setNivelActual(nuevoNivel);
                xpInfo.setRango(determinarRango(nuevoNivel));
            }
            
            usuarioXPRepository.save(xpInfo);

            return ResponseEntity.ok(Map.of(
                "message", "Memoria guardada y experiencia actualizada",
                "xp_ganada", "50",
                "nivel_actual", String.valueOf(xpInfo.getNivelActual())
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error interno al guardar la memoria"));
        }
    }

    // Pequeño método helper para dar títulos según el nivel
    private String determinarRango(int nivel) {
        if (nivel >= 20) return "Sapa Inca";
        if (nivel >= 10) return "Maestro Andino";
        if (nivel >= 5) return "Explorador Experto";
        return "Viajero Novato";
    }
}