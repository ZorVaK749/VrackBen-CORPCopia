package ms_vehicle_history.vehicle_history.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleHistoryRequestDTO {
    private String vin;
    private String description;
    private Integer mileage;
    private String technicianName;
}
