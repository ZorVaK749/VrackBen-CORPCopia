package ms_shopping_cart.shopping_cart.service;

import ms_shopping_cart.shopping_cart.model.CartItem;
import ms_shopping_cart.shopping_cart.repository.CartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private CartService cartService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddToCart() {
        // Arrange
        CartItem item = new CartItem(null, "user1", 100L, 1, 5000.0);
        when(cartRepository.save(item)).thenReturn(new CartItem(1L, "user1", 100L, 1, 5000.0));

        // Act
        CartItem result = cartService.addToCart(item);

        // Assert
        assertNotNull(result.getId());
        assertEquals(1, result.getQuantity());
        verify(cartRepository, times(1)).save(item);
    }

    @Test
    void testGetItemsByCustomer() {
        // Arrange
        CartItem item1 = new CartItem(1L, "user1", 100L, 1, 5000.0);
        CartItem item2 = new CartItem(2L, "user1", 101L, 2, 8000.0);
        when(cartRepository.findByCustomerRut("user1")).thenReturn(Arrays.asList(item1, item2));

        // Act
        List<CartItem> result = cartService.getItemsByCustomer("user1");

        // Assert
        assertEquals(2, result.size());
        verify(cartRepository, times(1)).findByCustomerRut("user1");
    }

    @Test
    void testClearCart() {
        // Act
        cartService.clearCart("user1");

        // Assert
        verify(cartRepository, times(1)).deleteByCustomerRut("user1");
    }
}
