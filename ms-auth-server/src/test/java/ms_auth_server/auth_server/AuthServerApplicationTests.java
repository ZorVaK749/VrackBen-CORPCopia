package ms_auth_server.auth_server;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Test de integración: requiere PostgreSQL real o Testcontainers. Tests unitarios en AuthServiceTest.")
class AuthServerApplicationTests {

	@Test
	void contextLoads() {
	}

}
