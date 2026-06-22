package ms_vehicle_history.vehicle_history.controller;

import ms_vehicle_history.vehicle_history.model.VehicleHistory;
import ms_vehicle_history.vehicle_history.service.VehicleHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import ms_vehicle_history.vehicle_history.dto.VehicleHistoryRequestDTO;
import ms_vehicle_history.vehicle_history.dto.VehicleHistoryResponseDTO;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
public class VehicleHistoryController {
    @Autowired
    private VehicleHistoryService service;

    @PostMapping("/add")
    public VehicleHistoryResponseDTO createEntry(@RequestBody VehicleHistoryRequestDTO request) {
        VehicleHistory entry = new VehicleHistory();
        entry.setVin(request.getVin());
        entry.setDescription(request.getDescription());
        entry.setMileage(request.getMileage());
        entry.setTechnicianName(request.getTechnicianName());
        
        VehicleHistory savedEntry = service.addEntry(entry);
        return convertToDTO(savedEntry);
    }

    @GetMapping("/{vin}")
    public List<VehicleHistoryResponseDTO> getHistory(@PathVariable String vin) {
        return service.getFullHistory(vin).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private VehicleHistoryResponseDTO convertToDTO(VehicleHistory entry) {
        return new VehicleHistoryResponseDTO(
                entry.getId(),
                entry.getVin(),
                entry.getDescription(),
                entry.getServiceDate(),
                entry.getMileage(),
                entry.getTechnicianName()
        );
    }
}
