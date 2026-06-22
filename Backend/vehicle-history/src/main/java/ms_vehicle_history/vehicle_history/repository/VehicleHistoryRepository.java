package ms_vehicle_history.vehicle_history.repository;

import ms_vehicle_history.vehicle_history.model.VehicleHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleHistoryRepository extends JpaRepository<VehicleHistory, Long> {
    // Busca todo el historial de un auto específico ordenado por fecha
    List<VehicleHistory> findByVinOrderByServiceDateDesc(String vin);
}