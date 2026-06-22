package ms_job_orders.job_orders.service;

import ms_job_orders.job_orders.model.JobOrder;
import ms_job_orders.job_orders.repository.JobOrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JobOrderServiceTest {

    @Mock
    private JobOrderRepository repository;

    @InjectMocks
    private JobOrderService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateOrder() {
        // Arrange
        JobOrder order = new JobOrder();
        order.setVehicleVin("VIN123");
        
        JobOrder savedOrder = new JobOrder();
        savedOrder.setId(1L);
        savedOrder.setVehicleVin("VIN123");
        savedOrder.setStatus("IN_PROGRESS");
        savedOrder.setStartTime(LocalDateTime.now());

        when(repository.save(any(JobOrder.class))).thenReturn(savedOrder);

        // Act
        JobOrder result = service.createOrder(order);

        // Assert
        assertEquals("IN_PROGRESS", result.getStatus());
        assertNotNull(result.getStartTime());
        verify(repository, times(1)).save(order);
    }

    @Test
    void testCompleteOrder_Success() {
        // Arrange
        JobOrder order = new JobOrder();
        order.setId(1L);
        order.setStatus("IN_PROGRESS");

        JobOrder savedOrder = new JobOrder();
        savedOrder.setId(1L);
        savedOrder.setStatus("COMPLETED");
        savedOrder.setEndTime(LocalDateTime.now());

        when(repository.findById(1L)).thenReturn(Optional.of(order));
        when(repository.save(any(JobOrder.class))).thenReturn(savedOrder);

        // Act
        JobOrder result = service.completeOrder(1L);

        // Assert
        assertEquals("COMPLETED", result.getStatus());
        assertNotNull(result.getEndTime());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(order);
    }

    @Test
    void testCompleteOrder_NotFound_ThrowsException() {
        // Arrange
        when(repository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            service.completeOrder(99L);
        });

        assertEquals("Orden no encontrada", exception.getMessage());
        verify(repository, times(1)).findById(99L);
        verify(repository, never()).save(any(JobOrder.class));
    }
}
