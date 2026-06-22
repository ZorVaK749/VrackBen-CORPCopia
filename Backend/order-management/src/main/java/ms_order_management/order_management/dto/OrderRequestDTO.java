package ms_order_management.order_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de solicitud para crear una orden de compra.
 * El frontend envía la info del carrito del cliente.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {
    private String username;     // Identificador del usuario (email/login)
    private String customerRut;  // RUT del cliente (opcional)
    private Long productId;
    private String productName;  // Nombre del producto al momento de comprar
    private Integer quantity;
    private Double totalAmount;
}
