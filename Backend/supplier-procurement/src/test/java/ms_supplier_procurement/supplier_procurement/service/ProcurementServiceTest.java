package ms_supplier_procurement.supplier_procurement.service;

import ms_supplier_procurement.supplier_procurement.model.SupplierOrder;
import ms_supplier_procurement.supplier_procurement.repository.ProcurementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProcurementServiceTest {

    @Mock
    private ProcurementRepository repository;

    @InjectMocks
    private ProcurementService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreatePurchaseOrder() {
        // Arrange
        SupplierOrder order = new SupplierOrder();
        order.setProductSku("SKU123");
        order.setQuantity(10);

        SupplierOrder savedOrder = new SupplierOrder();
        savedOrder.setId(1L);
        savedOrder.setProductSku("SKU123");
        savedOrder.setQuantity(10);
        savedOrder.setStatus("PENDING");
        savedOrder.setOrderDate(LocalDateTime.now());

        when(repository.save(any(SupplierOrder.class))).thenReturn(savedOrder);

        // Act
        SupplierOrder result = service.createPurchaseOrder(order);

        // Assert
        assertEquals("PENDING", result.getStatus());
        assertNotNull(result.getOrderDate());
        assertEquals(1L, result.getId());
        verify(repository, times(1)).save(order);
    }

    @Test
    void testUpdateOrderStatus_Success() {
        // Arrange
        SupplierOrder order = new SupplierOrder();
        order.setId(1L);
        order.setStatus("PENDING");

        SupplierOrder updatedOrder = new SupplierOrder();
        updatedOrder.setId(1L);
        updatedOrder.setStatus("APPROVED");

        when(repository.findById(1L)).thenReturn(Optional.of(order));
        when(repository.save(any(SupplierOrder.class))).thenReturn(updatedOrder);

        // Act
        SupplierOrder result = service.updateOrderStatus(1L, "APPROVED");

        // Assert
        assertEquals("APPROVED", result.getStatus());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(order);
    }

    @Test
    void testUpdateOrderStatus_NotFound_ThrowsException() {
        // Arrange
        when(repository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            service.updateOrderStatus(99L, "APPROVED");
        });

        assertEquals("Orden de compra no encontrada", exception.getMessage());
        verify(repository, times(1)).findById(99L);
        verify(repository, never()).save(any(SupplierOrder.class));
    }

    @Test
    void testGetAllOrders() {
        // Arrange
        when(repository.findAll()).thenReturn(Arrays.asList(new SupplierOrder(), new SupplierOrder()));

        // Act
        List<SupplierOrder> result = service.getAllOrders();

        // Assert
        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }
}
