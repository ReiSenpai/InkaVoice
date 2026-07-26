package backend.inkavoice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rutas_arqueologicas")
public class RutaArqueologica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String categoria; // arqueologico, natural, colonial
    private String descripcion;
    private String distanciaKm;
    
    private Double latitud;
    private Double longitud;
    
    private String imagenUrl;
    private String colorPin;
    private String icon;

    // Constructor vacío requerido por JPA
    public RutaArqueologica() {}

    // Getters y Setters para todos los campos
    public Long getId() { 
        return id; 
    }
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getNombre() { 
        return nombre; 
    }
    public void setNombre(String nombre) { 
        this.nombre = nombre; 
    }

    public String getCategoria() { 
        return categoria; 
    }
    public void setCategoria(String categoria) { 
        this.categoria = categoria; 
    }

    public String getDescripcion() { 
        return descripcion; 
    }
    public void setDescripcion(String descripcion) { 
        this.descripcion = descripcion; 
    }

    public String getDistanciaKm() { 
        return distanciaKm; 
    }
    public void setDistanciaKm(String distanciaKm) { 
        this.distanciaKm = distanciaKm; 
    }

    public Double getLatitud() { 
        return latitud; 
    }
    public void setLatitud(Double latitud) { 
        this.latitud = latitud; 
    }

    public Double getLongitud() { 
        return longitud; 
    }
    public void setLongitud(Double longitud) { 
        this.longitud = longitud; 
    }

    public String getImagenUrl() { 
        return imagenUrl; 
    }
    public void setImagenUrl(String imagenUrl) { 
        this.imagenUrl = imagenUrl; 
    }

    public String getColorPin() { 
        return colorPin; 
    }
    public void setColorPin(String colorPin) { 
        this.colorPin = colorPin; 
    }

    public String getIcon() { 
        return icon; 
    }
    public void setIcon(String icon) { 
        this.icon = icon; 
    }
}