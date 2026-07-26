package backend.inkavoice.repository;

import backend.inkavoice.entity.RutaArqueologica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RutaArqueologicaRepository extends JpaRepository<RutaArqueologica, Long> {
}