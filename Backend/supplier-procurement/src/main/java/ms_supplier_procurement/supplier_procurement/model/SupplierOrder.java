package ms_supplier_procurement.supplier_procurement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "supplier_orders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class SupplierOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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