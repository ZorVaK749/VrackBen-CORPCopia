package ms_catalog.catalog.repository;

import ms_catalog.catalog.model.ProductCatalog;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test de integración para {@link CatalogRepository}.
 *
 * <p>Versión Lite: usa {@code @DataJpaTest} con H2 en memoria —
 * sin Testcontainers, sin PostgreSQL, sin Docker. Corre en cualquier
 * entorno (local, GitHub Actions) sin dependencias externas.</p>
 *
 * <p>{@code @DataJpaTest} levanta solo la capa JPA (Hibernate + H2)
 * con rollback automático entre tests, manteniendo el aislamiento.</p>
 */
@SpringBootTest
@ActiveProfiles("test")
class CatalogRepositoryIntegrationTest {

    @Autowired
    private CatalogRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

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

    @Test
    void shouldFindAllProducts() {
        // Arrange
        ProductCatalog p1 = new ProductCatalog(null, "SKU-A", "Aceite Motor", "Mobil", "Lubricantes", "5W-30", 55.0, 10, null);
        ProductCatalog p2 = new ProductCatalog(null, "SKU-B", "Pastillas Freno", "Brembo", "Frenos", "Cerámica", 38.0, 20, null);
        repository.saveAll(List.of(p1, p2));

        // Act
        List<ProductCatalog> all = repository.findAll();

        // Assert
        assertThat(all).hasSize(2);
        assertThat(all).extracting(ProductCatalog::getSku).containsExactlyInAnyOrder("SKU-A", "SKU-B");
    }

    @Test
    void shouldDeleteProductBySku() {
        // Arrange
        ProductCatalog product = new ProductCatalog(null, "SKU-DEL", "Batería", "Optima", "Eléctrico", "12V 60Ah", 189.0, 5, null);
        repository.save(product);

        // Act
        ProductCatalog found = repository.findBySku("SKU-DEL").orElseThrow();
        repository.delete(found);

        // Assert
        assertThat(repository.findBySku("SKU-DEL")).isEmpty();
    }
}
