package backend.inkavoice.repository;
import backend.inkavoice.entity.Memoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MemoriaRepository extends JpaRepository<Memoria, Long> {
    List<Memoria> findByUsuarioIdOrderByFechaEscaneoDesc(Long usuarioId);
}