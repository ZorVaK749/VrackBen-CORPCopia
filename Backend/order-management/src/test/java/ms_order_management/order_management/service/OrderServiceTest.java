package ms_order_management.order_management.service;

import ms_order_management.order_management.client.StockClient;
import ms_order_management.order_management.model.Order;
import ms_order_management.order_management.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private StockClient stockClient;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testPlaceOrder_Success() {
        // Arrange
        Order order = new Order();
        order.setProductId(1L);
        order.setQuantity(2);
        
        Order savedOrder = new Order();
        savedOrder.setId(1L);
        savedOrder.setProductId(1L);
        savedOrder.setQuantity(2);
        savedOrder.setStatus("COMPLETED");

        doNothing().when(stockClient).reduceStock(1L, 2);
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        // Act
        Order result = orderService.placeOrder(order);

        // Assert
        assertEquals("COMPLETED", result.getStatus());
        verify(stockClient, times(1)).reduceStock(1L, 2);
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testPlaceOrder_NoStock_ThrowsException() {
        // Arrange
        Order order = new Order();
        order.setProductId(1L);
        order.setQuantity(200); // Exceeds stock
        
        Order savedOrder = new Order();
        savedOrder.setId(1L);
        savedOrder.setProductId(1L);
        savedOrder.setQuantity(200);
        savedOrder.setStatus("FAILED - NO STOCK");

        doThrow(new RuntimeException("Stock insuficiente")).when(stockClient).reduceStock(1L, 200);
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        // Act
        Order result = orderService.placeOrder(order);

        // Assert
        assertEquals("FAILED - NO STOCK", result.getStatus());
        verify(stockClient, times(1)).reduceStock(1L, 200);
        verify(orderRepository, times(1)).save(order);
    }
}
