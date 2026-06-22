package ms_job_orders.job_orders.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_orders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class JobOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleVin;
    private String mechanicId;
    private String description;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String status;
    private Double laborCost;
}