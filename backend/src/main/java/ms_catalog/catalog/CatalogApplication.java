package ms_catalog.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Aplicación principal del microservicio ms-catalog (versión Lite).
 *
 * <p>Versión standalone para despliegue en AWS ECS Fargate.</p>
 * <p>Usa H2 en memoria como base de datos — sin dependencias externas.</p>
 *
 * <p>CAMBIOS vs versión original:</p>
 * <ul>
 *   <li>Se eliminó {@code @EnableCaching} (dependía de Redis)</li>
 *   <li>Se eliminó Eureka Client (no hay registro de servicios)</li>
 *   <li>Base de datos cambiada de PostgreSQL → H2 in-memory</li>
 * </ul>
 */
@SpringBootApplication
public class CatalogApplication {

	public static void main(String[] args) {
		SpringApplication.run(CatalogApplication.class, args);
	}

}
