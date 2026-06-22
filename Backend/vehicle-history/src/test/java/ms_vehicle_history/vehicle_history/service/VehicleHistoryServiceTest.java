package ms_vehicle_history.vehicle_history.service;

import ms_vehicle_history.vehicle_history.model.VehicleHistory;
import ms_vehicle_history.vehicle_history.repository.VehicleHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VehicleHistoryServiceTest {

    @Mock
    private VehicleHistoryRepository repository;

    @InjectMocks
    private VehicleHistoryService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddEntry() {
        // Arrange
        VehicleHistory entry = new VehicleHistory();
        entry.setVin("VIN123");
        entry.setDescription("Cambio de aceite");

        VehicleHistory savedEntry = new VehicleHistory();
        savedEntry.setId(1L);
        savedEntry.setVin("VIN123");
        savedEntry.setDescription("Cambio de aceite");
        savedEntry.setServiceDate(LocalDateTime.now());

        when(repository.save(any(VehicleHistory.class))).thenReturn(savedEntry);

        // Act
        VehicleHistory result = service.addEntry(entry);

        // Assert
        assertNotNull(result.getServiceDate());
        assertEquals(1L, result.getId());
        assertEquals("VIN123", result.getVin());
        verify(repository, times(1)).save(entry);
    }

    @Test
    void testGetFullHistory() {
        // Arrange
        VehicleHistory entry1 = new VehicleHistory();
        entry1.setVin("VIN123");
        VehicleHistory entry2 = new VehicleHistory();
        entry2.setVin("VIN123");

        when(repository.findByVinOrderByServiceDateDesc("VIN123")).thenReturn(Arrays.asList(entry1, entry2));

        // Act
        List<VehicleHistory> result = service.getFullHistory("VIN123");

        // Assert
        assertEquals(2, result.size());
        verify(repository, times(1)).findByVinOrderByServiceDateDesc("VIN123");
    }
}
