package ms_shopping_cart.shopping_cart.controller;

import ms_shopping_cart.shopping_cart.model.CartItem;
import ms_shopping_cart.shopping_cart.service.CartService;
import ms_shopping_cart.shopping_cart.dto.CartItemDTO;
import ms_shopping_cart.shopping_cart.dto.CartItemRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService service;

    @PostMapping("/add")
    public CartItemDTO add(@RequestBody CartItemRequestDTO request) {
        CartItem item = new CartItem();
        item.setCustomerRut(request.getCustomerRut());
        item.setProductId(request.getProductId());
        item.setQuantity(request.getQuantity());
        item.setUnitPrice(request.getUnitPrice());
        
        CartItem savedItem = service.addToCart(item);
        return convertToDTO(savedItem);
    }

    @GetMapping("/{rut}")
    public List<CartItemDTO> getCart(@PathVariable String rut) {
        return service.getItemsByCustomer(rut).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/clear/{rut}")
    public String clear(@PathVariable String rut) {
        service.clearCart(rut);
        return "Carrito de " + rut + " vaciado correctamente.";
    }

    private CartItemDTO convertToDTO(CartItem item) {
        return new CartItemDTO(
                item.getId(),
                item.getCustomerRut(),
                item.getProductId(),
                item.getQuantity(),
                item.getUnitPrice()
        );
    }
}