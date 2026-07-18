package backend.inkavoice.dto;

import lombok.Data;

@Data
public class AuthRequestDTO {
    private String email;
    private String nombre;
    private String password;
}
