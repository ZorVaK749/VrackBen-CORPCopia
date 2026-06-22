package ms_catalog.catalog;

import org.springframework.boot.SpringApplication;

/**
 * Punto de entrada alternativo para ejecutar la aplicación en modo test (desarrollo local).
 * Versión Lite: usa H2 en memoria directamente, sin necesidad de TestcontainersConfiguration.
 */
public class TestCatalogApplication {

	public static void main(String[] args) {
		SpringApplication.from(CatalogApplication::main).run(args);
	}

}
