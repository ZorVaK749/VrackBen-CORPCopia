package ms_shopping_cart.shopping_cart.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shopping_cart")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerRut;
    private Long productId;
    private Integer quantity;
    private Double unitPrice;
}
