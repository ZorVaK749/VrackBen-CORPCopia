package ms_auth_server.auth_server.config;

import ms_auth_server.auth_server.model.User;
import ms_auth_server.auth_server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Crea los usuarios por defecto al iniciar la aplicación si no existen.
 * Esto garantiza que siempre haya usuarios disponibles para probar el sistema,
 * incluso después de un 'docker compose down -v' que elimina el volumen de la
 * BD.
 */
@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        crearUsuarioSiNoExiste("Vicente Placencia", "Admin.123", Set.of("ADMIN"));
        crearUsuarioSiNoExiste("Jorge Barria", "Mecanico.123", Set.of("MECANICO"));
        crearUsuarioSiNoExiste("Ian Badilla", "Cliente.123", Set.of("USER"));
        crearUsuarioSiNoExiste("Matias Espinoza", "Cliente.123", Set.of("USER"));
        System.out.println("[DataInitializer] Usuarios por defecto verificados/creados.");
    }

    private void crearUsuarioSiNoExiste(String username, String rawPassword, Set<String> roles) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRoles(roles);
            userRepository.save(user);
            System.out.println("[DataInitializer] Usuario creado: " + username);
        }
    }
}
