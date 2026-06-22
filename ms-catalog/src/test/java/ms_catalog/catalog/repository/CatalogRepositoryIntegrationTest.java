package ms_catalog.catalog.repository;

import ms_catalog.catalog.model.ProductCatalog;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test de integración para CatalogRepository.
 * Usa @SpringBootTest(NONE) con Testcontainers para validar la capa de persistencia
 * contra un PostgreSQL real (efímero), compatible con Spring Boot 4.x.
 */
@Testcontainers
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.NONE,
    properties = {
        "eureka.client.enabled=false",
        "spring.cloud.discovery.enabled=false"
    }
)
class CatalogRepositoryIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @Autowired
    private CatalogRepository repository;

    @Test
    void shouldPersistAndFindProductBySku() {
        // Arrange
        ProductCatalog product = new ProductCatalog(
                null, "INT-SKU-001", "Filtro de Aire", "Bosch",
                "Motor", "Filtro de aire de alto flujo", 12990.0, 50, null
        );

        // Act
        repository.save(product);
        Optional<ProductCatalog> result = repository.findBySku("INT-SKU-001");

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Filtro de Aire");
        assertThat(result.get().getId()).isNotNull();
    }

    @Test
    void shouldReturnEmptyWhenSkuNotFound() {
        // Act
        Optional<ProductCatalog> result = repository.findBySku("NO-EXISTE");

        // Assert
        assertThat(result).isEmpty();
    }
}
