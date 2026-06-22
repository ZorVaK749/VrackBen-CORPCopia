package ms_order_management.order_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para una orden de compra.
 * Incluye el nombre del producto para mostrarlo en el historial del cliente.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private String username;
    private String customerRut;
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double totalAmount;
    private LocalDateTime orderDate;
    private String status;
}
