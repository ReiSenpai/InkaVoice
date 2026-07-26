package backend.inkavoice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "memorias")
public class Memoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el Usuario existente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private String lugarDetectado;
    
    @Column(length = 1000)
    private String fotoUrl;
    
    @Column(length = 2000)
    private String descripcion;

    private LocalDateTime fechaEscaneo;

    @PrePersist
    protected void onCreate() {
        this.fechaEscaneo = LocalDateTime.now();
    }

    // Constructor, Getters y Setters
    public Memoria() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public String getLugarDetectado() { return lugarDetectado; }
    public void setLugarDetectado(String lugarDetectado) { this.lugarDetectado = lugarDetectado; }
    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDateTime getFechaEscaneo() { return fechaEscaneo; }
    public void setFechaEscaneo(LocalDateTime fechaEscaneo) { this.fechaEscaneo = fechaEscaneo; }
}