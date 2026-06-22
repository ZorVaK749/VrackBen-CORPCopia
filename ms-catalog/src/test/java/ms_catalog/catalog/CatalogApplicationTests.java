package ms_catalog.catalog;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Test de integración: requiere PostgreSQL real o Testcontainers. Tests unitarios en CatalogServiceTest.")
class CatalogApplicationTests {

	@Test
	void contextLoads() {
	}

}

