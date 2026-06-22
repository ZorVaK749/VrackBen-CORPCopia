package ms_order_management.order_management.service;

import ms_order_management.order_management.client.StockClient;
import ms_order_management.order_management.messaging.OrderEvent;
import ms_order_management.order_management.messaging.RabbitMQConfig;
import ms_order_management.order_management.model.Order;
import ms_order_management.order_management.repository.OrderRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio que gestiona la lógica de negocio para las órdenes de compra.
 *
 * <p>Coordina tres responsabilidades principales:</p>
 * <ol>
 *   <li>Descuenta inventario en ms-stock-engine vía Feign Client.</li>
 *   <li>Persiste la orden con su estado final (COMPLETED / FAILED - NO STOCK).</li>
 *   <li>Publica un {@link OrderEvent} en RabbitMQ para notificaciones asíncronas.</li>
 * </ol>
 */
@Service
public class OrderService {

    @Autowired
    private OrderRepository repository;

    @Autowired
    private StockClient stockClient;

    /**
     * RabbitTemplate para publicar eventos de órdenes al exchange de mensajería.
     * Spring AMQP lo autoconfigura con los parámetros de {@code application.properties}.
     */
    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * Procesa una orden de compra. Descuenta el stock vía Feign al ms-stock-engine.
     * Si hay suficiente stock, la orden queda COMPLETED. Si no, FAILED - NO STOCK.
     * En ambos casos publica un {@link OrderEvent} en RabbitMQ.
     *
     * @param order La orden a procesar.
     * @return La orden persistida con su estado final.
     */
    public Order placeOrder(Order order) {
        try {
            stockClient.reduceStock(order.getProductId(), order.getQuantity());
            order.setOrderDate(LocalDateTime.now());
            order.setStatus("COMPLETED");
            Order saved = repository.save(order);
            publishOrderEvent(saved);
            return saved;
        } catch (Exception e) {
            order.setOrderDate(LocalDateTime.now());
            order.setStatus("FAILED - NO STOCK");
            Order saved = repository.save(order);
            publishOrderEvent(saved);
            return saved;
        }
    }

    /**
     * Construye y publica un {@link OrderEvent} en el exchange de RabbitMQ.
     * El mensaje es procesado de forma asíncrona por {@code OrderNotificationListener}.
     *
     * @param order La orden ya persistida con ID y estado asignados.
     */
    private void publishOrderEvent(Order order) {
        OrderEvent event = new OrderEvent(
                order.getId(),
                order.getUsername(),
                order.getProductName(),
                order.getQuantity(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderDate()
        );
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                RabbitMQConfig.ROUTING_KEY,
                event
        );
    }

    /**
     * Obtiene todas las órdenes de un usuario ordenadas de más reciente a más antigua.
     *
     * @param username El nombre de usuario (email/login).
     * @return Lista de órdenes del usuario.
     */
    public List<Order> getOrdersByUser(String username) {
        return repository.findByUsernameOrderByOrderDateDesc(username);
    }
}
