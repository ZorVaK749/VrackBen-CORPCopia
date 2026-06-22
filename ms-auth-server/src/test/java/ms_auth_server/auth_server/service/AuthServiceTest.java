package ms_auth_server.auth_server.service;

import ms_auth_server.auth_server.dto.LoginRequestDTO;
import ms_auth_server.auth_server.dto.LoginResponseDTO;
import ms_auth_server.auth_server.dto.UserRegisterDTO;
import ms_auth_server.auth_server.model.User;
import ms_auth_server.auth_server.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoginSuccess() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("user");
        request.setPassword("password");
        
        User user = new User();
        user.setUsername("user");
        user.setPassword("hashedPassword");
        user.setRoles(Set.of("USER"));

        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "hashedPassword")).thenReturn(true);
        when(jwtService.generateToken(eq("user"), anySet())).thenReturn("jwt-token-123");

        LoginResponseDTO response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token-123", response.getToken());
        assertEquals("user", response.getUsername());
    }

    @Test
    void testLoginInvalidCredentials() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("user");
        request.setPassword("wrongpassword");
        
        User user = new User();
        user.setUsername("user");
        user.setPassword("hashedPassword");

        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "hashedPassword")).thenReturn(false);

        assertThrows(ms_auth_server.auth_server.exception.InvalidCredentialsException.class, () -> {
            authService.login(request);
        });
    }

    @Test
    void testRegisterSuccess() {
        UserRegisterDTO dto = new UserRegisterDTO("newuser", "password", java.util.Set.of("USER"));

        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("hashedPassword");

        boolean result = authService.register(dto);

        assertTrue(result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUserAlreadyExists() {
        UserRegisterDTO dto = new UserRegisterDTO("existing", "password", java.util.Set.of("USER"));
        User existingUser = new User();
        
        when(userRepository.findByUsername("existing")).thenReturn(Optional.of(existingUser));

        assertThrows(ms_auth_server.auth_server.exception.UserAlreadyExistsException.class, () -> {
            authService.register(dto);
        });
        verify(userRepository, never()).save(any());
    }

    @Test
    void testGetUserByUsernameSuccess() {
        User user = new User();
        user.setUsername("testuser");
        user.setRoles(Set.of("USER"));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        UserRegisterDTO result = authService.getUserByUsername("testuser");

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertTrue(result.getRoles().contains("USER"));
    }

    @Test
    void testGetUserByUsernameNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(ms_auth_server.auth_server.exception.UserNotFoundException.class, () -> {
            authService.getUserByUsername("unknown");
        });
    }
}
