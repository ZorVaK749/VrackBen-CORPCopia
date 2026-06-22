package ms_job_orders.job_orders.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobOrderRequestDTO {
    private String vehicleVin;
    private String mechanicId;
    private String description;
    private Double laborCost;
}
