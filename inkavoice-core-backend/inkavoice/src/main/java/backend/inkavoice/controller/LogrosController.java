package backend.inkavoice.controller;

import backend.inkavoice.entity.UsuarioXP;
import backend.inkavoice.repository.UsuarioXPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logros")
@CrossOrigin(origins = "*")
public class LogrosController {

    @Autowired
    private UsuarioXPRepository usuarioXPRepository;

    @GetMapping("/ranking")
    public ResponseEntity<List<Map<String, Object>>> obtenerRankingGlobal() {
        // Obtenemos todos los usuarios ordenados por XP de mayor a menor
        List<UsuarioXP> ranking = usuarioXPRepository.findAllByOrderByXpTotalDesc();
        List<Map<String, Object>> rankingFormateado = new ArrayList<>();

        for (UsuarioXP xp : ranking) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", xp.getUsuario().getId().toString());
            userMap.put("name", xp.getUsuario().getNombre());
            userMap.put("location", "Perú"); // Puede ser dinámico si agregas ubicación al Usuario
            userMap.put("xp", xp.getXpTotal());
            
            // Generamos un avatar dinámico con las iniciales del usuario usando ui-avatars
            String avatarUrl = "https://ui-avatars.com/api/?name=" + xp.getUsuario().getNombre().replace(" ", "+") + "&background=00332D&color=FCD34D";
            userMap.put("avatar", avatarUrl);
            
            rankingFormateado.add(userMap);
        }
        
        return ResponseEntity.ok(rankingFormateado);
    }
}