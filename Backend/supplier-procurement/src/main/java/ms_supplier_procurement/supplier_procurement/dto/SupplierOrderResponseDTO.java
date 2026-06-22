package ms_supplier_procurement.supplier_procurement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierOrderResponseDTO {
    private Long id;
    private String mechanicUsername;
    private String workOrderId;
    private String partName;
    private String productSku;
    private Integer quantity;
    private String urgency;
    private String notes;
    private LocalDateTime orderDate;
    private String status;
}
