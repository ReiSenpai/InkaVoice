package backend.inkavoice.repository;
import backend.inkavoice.entity.UsuarioXP;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsuarioXPRepository extends JpaRepository<UsuarioXP, Long> {
    List<UsuarioXP> findAllByOrderByXpTotalDesc(); // Para el ranking
    UsuarioXP findByUsuarioId(Long usuarioId);
}