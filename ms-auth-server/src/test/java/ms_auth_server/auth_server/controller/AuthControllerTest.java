package ms_auth_server.auth_server.controller;

import ms_auth_server.auth_server.dto.LoginRequestDTO;
import ms_auth_server.auth_server.dto.LoginResponseDTO;
import ms_auth_server.auth_server.dto.UserRegisterDTO;
import ms_auth_server.auth_server.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLogin() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("admin");
        request.setPassword("password");

        LoginResponseDTO mockResponse = new LoginResponseDTO("token123", "admin", "Login exitoso");
        when(authService.login(any(LoginRequestDTO.class))).thenReturn(mockResponse);

        ResponseEntity<LoginResponseDTO> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("token123", response.getBody().getToken());
    }

    @Test
    void testRegister() {
        UserRegisterDTO request = new UserRegisterDTO("newuser", "pass", Set.of("USER"));
        when(authService.register(any(UserRegisterDTO.class))).thenReturn(true);

        ResponseEntity<String> response = authController.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Usuario registrado exitosamente", response.getBody());
    }

    @Test
    void testGetUserByUsername() {
        UserRegisterDTO mockUser = new UserRegisterDTO("existinguser", null, Set.of("USER"));
        when(authService.getUserByUsername("existinguser")).thenReturn(mockUser);

        ResponseEntity<UserRegisterDTO> response = authController.getUserByUsername("existinguser");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("existinguser", response.getBody().getUsername());
    }
}
