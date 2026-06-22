package ms_shopping_cart.shopping_cart.repository;

import ms_shopping_cart.shopping_cart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    // Para obtener todos los productos que un cliente tiene en su carrito
    List<CartItem> findByCustomerRut(String customerRut);

    // Para limpiar el carrito después de una compra exitosa
    void deleteByCustomerRut(String customerRut);
}
