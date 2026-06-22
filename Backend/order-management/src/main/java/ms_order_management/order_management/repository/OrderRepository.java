package ms_order_management.order_management.repository;

import ms_order_management.order_management.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    /** Busca órdenes por el RUT del cliente (legacy) */
    List<Order> findByCustomerRut(String customerRut);

    /** Busca todas las órdenes por username (email del login) */
    List<Order> findByUsernameOrderByOrderDateDesc(String username);
}