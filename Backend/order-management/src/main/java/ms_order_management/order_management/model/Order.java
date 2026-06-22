package ms_order_management.order_management.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa una orden de compra en el sistema VraKBen.
 * Guarda el producto, cantidad, total y estado de la transacción.
 */
@Entity
@Table(name = "orders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;     // Usuario que realizó la compra (login/email)
    private String customerRut;  // RUT del cliente (opcional, legacy)
    private Long productId;
    private String productName;  // Nombre del producto al momento de la compra
    private Integer quantity;
    private Double totalAmount;
    private LocalDateTime orderDate;
    private String status; // COMPLETED, FAILED - NO STOCK
}