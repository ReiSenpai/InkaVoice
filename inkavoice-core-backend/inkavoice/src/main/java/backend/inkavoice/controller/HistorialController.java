package backend.inkavoice.controller;

import backend.inkavoice.entity.Memoria;
import backend.inkavoice.repository.MemoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin(origins = "*")
public class HistorialController {

    @Autowired
    private MemoriaRepository memoriaRepository;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Memoria>> obtenerHistorialUsuario(@PathVariable Long usuarioId) {
        List<Memoria> historial = memoriaRepository.findByUsuarioIdOrderByFechaEscaneoDesc(usuarioId);
        return ResponseEntity.ok(historial);
    }
}