package ms_stock_engine.stock_engine.service;

import ms_stock_engine.stock_engine.model.Product;
import ms_stock_engine.stock_engine.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StockServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private StockService stockService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testReduceStock_Success() {
        // Arrange
        Product product = new Product(1L, "Pastillas de freno", "SKU123", 50, 10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        Product updatedProduct = stockService.reduceStock(1L, 5);

        // Assert
        assertNotNull(updatedProduct);
        assertEquals(45, updatedProduct.getStock());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testReduceStock_ProductNotFound_ThrowsException() {
        // Arrange
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            stockService.reduceStock(99L, 5);
        });

        assertEquals("Producto no encontrado", exception.getMessage());
        verify(productRepository, times(1)).findById(99L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testReduceStock_InsufficientStock_ThrowsException() {
        // Arrange
        Product product = new Product(1L, "Pastillas de freno", "SKU123", 2, 10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            stockService.reduceStock(1L, 5);
        });

        assertEquals("Stock insuficiente para el producto: Pastillas de freno", exception.getMessage());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
    }
}
