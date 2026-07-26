package backend.inkavoice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario_xp")
public class UsuarioXP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private Usuario usuario;

    private Integer xpTotal = 0;
    private Integer nivelActual = 1;
    private String rango = "Viajero Novato"; // Ej: Explorador, Maestro Inca

    // Constructor, Getters y Setters
    public UsuarioXP() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Integer getXpTotal() { return xpTotal; }
    public void setXpTotal(Integer xpTotal) { this.xpTotal = xpTotal; }
    public Integer getNivelActual() { return nivelActual; }
    public void setNivelActual(Integer nivelActual) { this.nivelActual = nivelActual; }
    public String getRango() { return rango; }
    public void setRango(String rango) { this.rango = rango; }
}