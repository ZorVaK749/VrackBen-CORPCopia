package ms_auth_server.auth_server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
@AllArgsConstructor
@Schema(description = "DTO para la respuesta de login")
public class LoginResponseDTO {

    @Schema(description = "Token JWT generado", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;
    
    @Schema(description = "Nombre del usuario", example = "admin")
    private String username;
    
    @Schema(description = "Mensaje de respuesta", example = "Login exitoso")
    private String message;
}
