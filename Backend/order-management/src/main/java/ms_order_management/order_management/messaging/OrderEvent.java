package ms_order_management.order_management.messaging;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO que representa el evento publicado en RabbitMQ cuando una orden es procesada.
 * Implementa {@link Serializable} para la serialización por defecto de Spring AMQP.
 *
 * <p>Se publica en el exchange {@code vrakben.exchange} con routing key {@code order.completed}
 * tanto para órdenes exitosas (COMPLETED) como fallidas (FAILED - NO STOCK).</p>
 */
public class OrderEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long orderId;
    private String username;
    private String productName;
    private Integer quantity;
    private Double totalAmount;
    private String status;
    private LocalDateTime orderDate;

    public OrderEvent() {}

    public OrderEvent(Long orderId, String username, String productName,
                      Integer quantity, Double totalAmount, String status,
                      LocalDateTime orderDate) {
        this.orderId     = orderId;
        this.username    = username;
        this.productName = productName;
        this.quantity    = quantity;
        this.totalAmount = totalAmount;
        this.status      = status;
        this.orderDate   = orderDate;
    }

    // --- Getters ---
    public Long getOrderId()        { return orderId; }
    public String getUsername()     { return username; }
    public String getProductName()  { return productName; }
    public Integer getQuantity()    { return quantity; }
    public Double getTotalAmount()  { return totalAmount; }
    public String getStatus()       { return status; }
    public LocalDateTime getOrderDate() { return orderDate; }

    @Override
    public String toString() {
        return "OrderEvent{orderId=" + orderId +
               ", username='" + username + "'" +
               ", product='" + productName + "'" +
               ", qty=" + quantity +
               ", total=" + totalAmount +
               ", status='" + status + "'" +
               ", date=" + orderDate + "}";
    }
}
