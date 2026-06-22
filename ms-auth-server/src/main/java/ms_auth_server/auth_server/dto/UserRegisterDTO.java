package ms_auth_server.auth_server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO para el registro o visualización de un usuario")
public class UserRegisterDTO {
    @Schema(description = "Nombre de usuario", example = "nuevo_admin")
    private String username;
    
    @Schema(description = "Contraseña (en peticiones de creación)", example = "secreto123")
    private String password;
    
    @Schema(description = "Conjunto de roles asignados al usuario", example = "[\"ROLE_USER\", \"ROLE_ADMIN\"]")
    private Set<String> roles;
}
