package ms_catalog.catalog;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Smoke test: verifica que el contexto de Spring arranca correctamente
 * con H2 en memoria (sin PostgreSQL, sin Redis, sin Eureka).
 */
@SpringBootTest
class CatalogApplicationTests {

	@Test
	void contextLoads() {
		// Si este test pasa, la app puede arrancar en ECS sin dependencias externas
	}

}
