package ms_vehicle_history.vehicle_history.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_histories")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class VehicleHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vin;
    private String description;
    private LocalDateTime serviceDate;
    private Integer mileage;
    private String technicianName;
}
