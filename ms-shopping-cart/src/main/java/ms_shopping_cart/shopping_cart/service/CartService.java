package ms_shopping_cart.shopping_cart.service;

import ms_shopping_cart.shopping_cart.model.CartItem;
import ms_shopping_cart.shopping_cart.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartRepository repository;

    public CartItem addToCart(CartItem item) {
        return repository.save(item);
    }

    public List<CartItem> getItemsByCustomer(String rut) {
        return repository.findByCustomerRut(rut);
    }

    @Transactional
    public void clearCart(String rut) {
        repository.deleteByCustomerRut(rut);
    }
}