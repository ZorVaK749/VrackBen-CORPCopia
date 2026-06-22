package ms_shopping_cart.shopping_cart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private String customerRut;
    private Long productId;
    private Integer quantity;
    private Double unitPrice;
}
