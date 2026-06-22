package ms_supplier_procurement.supplier_procurement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierOrderRequestDTO {
    private String mechanicUsername;
    private String workOrderId;
    private String partName;
    private String sku;
    private Integer quantity;
    private String urgency;
    private String notes;
}
