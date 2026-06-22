package ms_auth_server.auth_server.service;

import ms_auth_server.auth_server.dto.LoginRequestDTO;
import ms_auth_server.auth_server.dto.LoginResponseDTO;
import ms_auth_server.auth_server.dto.UserRegisterDTO;
import ms_auth_server.auth_server.model.User;
import ms_auth_server.auth_server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Servicio encargado de la lógica de negocio para la autenticación y gestión de usuarios.
 * Interacciona con el repositorio de usuarios y el servicio JWT.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Valida las credenciales de un usuario y genera un token JWT si son correctas.
     * 
     * @param request Objeto que contiene el nombre de usuario y la contraseña.
     * @return Objeto LoginResponseDTO con el token JWT generado y detalles de la sesión.
     * @throws ms_auth_server.auth_server.exception.InvalidCredentialsException si el usuario no existe o la contraseña es incorrecta.
     */
    public LoginResponseDTO login(LoginRequestDTO request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            throw new ms_auth_server.auth_server.exception.InvalidCredentialsException("Credenciales inválidas");
        }
        User user = userOpt.get();
        String token = jwtService.generateToken(user.getUsername(), user.getRoles());
        return new LoginResponseDTO(token, user.getUsername(), "Login exitoso");
    }

    /**
     * Registra un nuevo usuario en la base de datos validando que no exista previamente.
     * Encripta la contraseña usando BCrypt antes de almacenarla.
     * 
     * @param request Objeto con la información del nuevo usuario a registrar.
     * @return {@code true} si el usuario fue registrado con éxito.
     * @throws ms_auth_server.auth_server.exception.UserAlreadyExistsException si el nombre de usuario ya se encuentra registrado.
     */
    public boolean register(UserRegisterDTO request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ms_auth_server.auth_server.exception.UserAlreadyExistsException("Usuario ya existe");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // Rol por defecto si no lo envían
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            user.setRoles(java.util.Set.of("USER"));
        } else {
            user.setRoles(request.getRoles());
        }
        
        userRepository.save(user);
        return true;
    }

    /**
     * Busca y devuelve los datos de un usuario por su nombre.
     * 
     * @param username El nombre de usuario a buscar.
     * @return Objeto UserRegisterDTO que expone de forma segura los datos del usuario.
     * @throws ms_auth_server.auth_server.exception.UserNotFoundException si el usuario no existe en la base de datos.
     */
    public UserRegisterDTO getUserByUsername(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new ms_auth_server.auth_server.exception.UserNotFoundException("Usuario no encontrado");
        }
        User user = userOpt.get();
        UserRegisterDTO dto = new UserRegisterDTO();
        dto.setUsername(user.getUsername());
        dto.setRoles(user.getRoles());
        return dto;
    }
}
