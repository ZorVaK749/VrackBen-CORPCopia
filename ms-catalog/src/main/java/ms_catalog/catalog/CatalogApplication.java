package ms_catalog.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Aplicación principal del microservicio ms-catalog.
 * Habilita el módulo de caché de Spring ({@link EnableCaching}) respaldado por Redis.
 * El catálogo de productos es cacheado para reducir la carga en la base de datos.
 */
@SpringBootApplication
@EnableCaching
public class CatalogApplication {

	public static void main(String[] args) {
		SpringApplication.run(CatalogApplication.class, args);
	}

}
