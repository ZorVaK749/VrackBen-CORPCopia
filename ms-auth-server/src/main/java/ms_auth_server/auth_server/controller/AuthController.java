package ms_auth_server.auth_server.controller;

import jakarta.validation.Valid;
import ms_auth_server.auth_server.dto.LoginRequestDTO;
import ms_auth_server.auth_server.dto.LoginResponseDTO;
import ms_auth_server.auth_server.dto.UserRegisterDTO;
import ms_auth_server.auth_server.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controlador REST que gestiona las operaciones de autenticación de usuarios.
 * Provee endpoints para login, registro y consulta de información de usuarios.
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "API de autenticación de usuarios")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Autentica a un usuario en el sistema usando sus credenciales.
     * 
     * @param request DTO que contiene el nombre de usuario y contraseña.
     * @return ResponseEntity con el token JWT generado y los detalles de la sesión.
     */
    @Operation(summary = "Login de usuario", description = "Autentica a un usuario y retorna un token JWT")
    @ApiResponse(responseCode = "200", description = "Login exitoso")
    @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Registra un nuevo usuario en el sistema.
     * 
     * @param request DTO con los datos del usuario a registrar (nombre, contraseña y roles).
     * @return ResponseEntity con un mensaje de confirmación del registro.
     */
    @Operation(summary = "Registro de usuario", description = "Registra un nuevo usuario en el sistema")
    @ApiResponse(responseCode = "200", description = "Usuario registrado exitosamente")
    @ApiResponse(responseCode = "400", description = "El usuario ya existe o datos inválidos")
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserRegisterDTO request) {
        authService.register(request);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }

    /**
     * Obtiene los detalles de un usuario a partir de su nombre de usuario.
     * 
     * @param username El nombre de usuario que se desea consultar.
     * @return ResponseEntity con los detalles del usuario encontrado (roles, etc).
     */
    @Operation(summary = "Obtener usuario por nombre", description = "Obtiene los detalles de un usuario registrado")
    @ApiResponse(responseCode = "200", description = "Usuario encontrado")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    @GetMapping("/users/{username}")
    public ResponseEntity<UserRegisterDTO> getUserByUsername(@PathVariable String username) {
        UserRegisterDTO user = authService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }
}
