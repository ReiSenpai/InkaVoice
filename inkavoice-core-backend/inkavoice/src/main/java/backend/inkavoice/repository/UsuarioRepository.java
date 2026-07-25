package backend.inkavoice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.inkavoice.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    Optional<Usuario> findByEmail(String email);
}
