package ms_vehicle_history.vehicle_history.service;

import ms_vehicle_history.vehicle_history.model.VehicleHistory;
import ms_vehicle_history.vehicle_history.repository.VehicleHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VehicleHistoryService {
    @Autowired
    private VehicleHistoryRepository repository;

    public VehicleHistory addEntry(VehicleHistory entry) {
        entry.setServiceDate(java.time.LocalDateTime.now());
        return repository.save(entry);
    }

    public List<VehicleHistory> getFullHistory(String vin) {
        return repository.findByVinOrderByServiceDateDesc(vin);
    }
}