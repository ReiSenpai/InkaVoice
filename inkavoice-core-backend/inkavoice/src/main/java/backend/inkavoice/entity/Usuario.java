package backend.inkavoice.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Data
@Entity
@Table(name = "Usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String nombre;
    
    private String password;
    
    @Column(nullable = false)
    private String authProvider;

    // --- NUEVAS CONEXIONES ---

    // 1. Relación 1 a 1 con la experiencia/gamificación
    // CascadeType.ALL asegura que si se crea un usuario, se puede crear su XP automáticamente
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Evita que se serialice en JSON creando un bucle infinito
    @ToString.Exclude // Evita que Lombok colapse la memoria al imprimir el objeto
    private UsuarioXP usuarioXP;

    // 2. Relación 1 a N con el historial de escaneos (Memorias)
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<Memoria> memorias;
}