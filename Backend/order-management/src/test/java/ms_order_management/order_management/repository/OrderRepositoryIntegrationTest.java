package ms_order_management.order_management.repository;

import ms_order_management.order_management.model.Order;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test de integración para OrderRepository.
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
class OrderRepositoryIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @Autowired
    private OrderRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void shouldSaveOrderAndFindByUsername() {
        // Arrange
        Order order = new Order(
                null, "cliente@test.com", "12345678-9",
                1L, "Filtro de Aceite", 2, 25980.0,
                LocalDateTime.now(), "COMPLETED"
        );

        // Act
        repository.save(order);
        List<Order> result = repository.findByUsernameOrderByOrderDateDesc("cliente@test.com");

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo("COMPLETED");
        assertThat(result.get(0).getProductName()).isEqualTo("Filtro de Aceite");
    }

    @Test
    void shouldFilterOrdersByUsername() {
        // Arrange: insertar órdenes de dos usuarios distintos
        Order o1 = new Order(null, "user_a@test.com", "111", 1L, "Bujía", 1, 5000.0, LocalDateTime.now(), "COMPLETED");
        Order o2 = new Order(null, "user_a@test.com", "111", 2L, "Filtro", 1, 8000.0, LocalDateTime.now(), "FAILED - NO STOCK");
        Order o3 = new Order(null, "user_b@test.com", "222", 3L, "Llanta", 4, 200000.0, LocalDateTime.now(), "COMPLETED");
        repository.saveAll(List.of(o1, o2, o3));

        // Act
        List<Order> resultA = repository.findByUsernameOrderByOrderDateDesc("user_a@test.com");
        List<Order> resultB = repository.findByUsernameOrderByOrderDateDesc("user_b@test.com");

        // Assert
        assertThat(resultA).hasSize(2);
        assertThat(resultB).hasSize(1);
        assertThat(resultB.get(0).getProductName()).isEqualTo("Llanta");
    }
}
