package ms_order_management.order_management.controller;

import ms_order_management.order_management.model.Order;
import ms_order_management.order_management.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ms_order_management.order_management.dto.OrderRequestDTO;
import ms_order_management.order_management.dto.OrderResponseDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST para la gestión de órdenes de compra.
 * Expone endpoints para crear órdenes (con descuento de stock) y consultar historial.
 */
@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "API de gestión de órdenes de compra")
public class OrderController {

    @Autowired
    private OrderService service;

    /**
     * Crea una nueva orden de compra. Descuenta el stock en ms-stock-engine.
     *
     * @param request DTO con los datos del item del carrito a convertir en orden.
     * @return La orden creada con su estado (COMPLETED o FAILED).
     */
    @Operation(summary = "Crear orden de compra", description = "Procesa un ítem del carrito y crea una orden, descontando stock automáticamente.")
    @PostMapping("/create")
    public ResponseEntity<OrderResponseDTO> create(@RequestBody OrderRequestDTO request) {
        Order order = new Order();
        order.setUsername(request.getUsername());
        order.setCustomerRut(request.getCustomerRut());
        order.setProductId(request.getProductId());
        order.setProductName(request.getProductName());
        order.setQuantity(request.getQuantity());
        order.setTotalAmount(request.getTotalAmount());

        Order savedOrder = service.placeOrder(order);
        return ResponseEntity.ok(convertToDTO(savedOrder));
    }

    /**
     * Retorna el historial de órdenes de un usuario, ordenadas de más reciente a más antigua.
     *
     * @param username El username (email) del usuario.
     * @return Lista de órdenes del usuario.
     */
    @Operation(summary = "Historial de órdenes", description = "Retorna todas las órdenes de un usuario específico.")
    @GetMapping("/my-orders/{username}")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders(@PathVariable String username) {
        List<OrderResponseDTO> orders = service.getOrdersByUser(username)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    private OrderResponseDTO convertToDTO(Order order) {
        return new OrderResponseDTO(
                order.getId(),
                order.getUsername(),
                order.getCustomerRut(),
                order.getProductId(),
                order.getProductName(),
                order.getQuantity(),
                order.getTotalAmount(),
                order.getOrderDate(),
                order.getStatus()
        );
    }
}