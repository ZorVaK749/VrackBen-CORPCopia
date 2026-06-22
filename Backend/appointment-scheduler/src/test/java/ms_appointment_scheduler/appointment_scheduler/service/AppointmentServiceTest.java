package ms_appointment_scheduler.appointment_scheduler.service;

import ms_appointment_scheduler.appointment_scheduler.client.StockClient;
import ms_appointment_scheduler.appointment_scheduler.model.Appointment;
import ms_appointment_scheduler.appointment_scheduler.repository.AppointmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentServiceTest {

    @Mock
    private AppointmentRepository repository;

    @Mock
    private StockClient stockClient;

    @InjectMocks
    private AppointmentService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateAppointment_Success_WithProductId() {
        // Arrange
        Appointment appointment = new Appointment();
        appointment.setCustomerUsername("user1");

        Appointment savedAppointment = new Appointment();
        savedAppointment.setId(1L);
        savedAppointment.setCustomerUsername("user1");
        savedAppointment.setStatus("CONFIRMED");

        doNothing().when(stockClient).reduceStock(1L, 1);
        when(repository.save(any(Appointment.class))).thenReturn(savedAppointment);

        // Act
        Appointment result = service.createAppointment(appointment, 1L);

        // Assert
        assertEquals("CONFIRMED", result.getStatus());
        verify(stockClient, times(1)).reduceStock(1L, 1);
        verify(repository, times(1)).save(appointment);
    }

    @Test
    void testCreateAppointment_Success_NoProductId() {
        // Arrange
        Appointment appointment = new Appointment();
        appointment.setCustomerUsername("user1");

        Appointment savedAppointment = new Appointment();
        savedAppointment.setId(1L);
        savedAppointment.setCustomerUsername("user1");
        savedAppointment.setStatus("CONFIRMED");

        when(repository.save(any(Appointment.class))).thenReturn(savedAppointment);

        // Act
        Appointment result = service.createAppointment(appointment, null);

        // Assert
        assertEquals("CONFIRMED", result.getStatus());
        verify(stockClient, never()).reduceStock(anyLong(), anyInt());
        verify(repository, times(1)).save(appointment);
    }

    @Test
    void testCreateAppointment_NoStock_ThrowsException() {
        // Arrange
        Appointment appointment = new Appointment();
        appointment.setCustomerUsername("user1");

        Appointment savedAppointment = new Appointment();
        savedAppointment.setId(1L);
        savedAppointment.setCustomerUsername("user1");
        savedAppointment.setStatus("REJECTED_NO_STOCK");

        doThrow(new RuntimeException("Stock insuficiente")).when(stockClient).reduceStock(1L, 1);
        when(repository.save(any(Appointment.class))).thenReturn(savedAppointment);

        // Act
        Appointment result = service.createAppointment(appointment, 1L);

        // Assert
        assertEquals("REJECTED_NO_STOCK", result.getStatus());
        verify(stockClient, times(1)).reduceStock(1L, 1);
        verify(repository, times(1)).save(appointment);
    }
}
