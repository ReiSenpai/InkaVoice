package backend.inkavoice.controller;

import backend.inkavoice.entity.RutaArqueologica;
import backend.inkavoice.repository.RutaArqueologicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mapa")
@CrossOrigin(origins = "*")
public class MapaController {

    @Autowired
    private RutaArqueologicaRepository rutaRepository;

    @GetMapping("/pines")
    public ResponseEntity<List<RutaArqueologica>> obtenerPinesMapa() {
        List<RutaArqueologica> rutas = rutaRepository.findAll();
        return ResponseEntity.ok(rutas);
    }
}