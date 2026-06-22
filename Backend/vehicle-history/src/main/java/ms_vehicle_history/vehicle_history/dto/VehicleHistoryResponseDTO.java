package ms_vehicle_history.vehicle_history.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleHistoryResponseDTO {
    private Long id;
    private String vin;
    private String description;
    private LocalDateTime serviceDate;
    private Integer mileage;
    private String technicianName;
}
