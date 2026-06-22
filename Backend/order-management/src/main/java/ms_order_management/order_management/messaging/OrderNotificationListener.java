package ms_order_management.order_management.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Consumer de RabbitMQ que escucha eventos de órdenes procesadas.
 *
 * <p>En este flujo simplificado, el listener <strong>loguea</strong> el evento
 * simulando el envío de un correo de confirmación al cliente. En producción,
 * este componente se movería a un microservicio dedicado {@code ms-notification}.</p>
 *
 * <p>Escucha la cola {@code vrakben.orders.queue} definida en {@link RabbitMQConfig}.</p>
 */
@Component
public class OrderNotificationListener {

    private static final Logger log = LoggerFactory.getLogger(OrderNotificationListener.class);

    /**
     * Recibe un {@link OrderEvent} desde RabbitMQ y simula el envío de notificación.
     *
     * @param event El evento de orden deserializado automáticamente por Spring AMQP.
     */
    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleOrderEvent(OrderEvent event) {
        if ("COMPLETED".equals(event.getStatus())) {
            log.info("📧 [NOTIFICACIÓN] Orden #{} completada para '{}' — Producto: '{}' x{} — Total: ${} — {}",
                    event.getOrderId(),
                    event.getUsername(),
                    event.getProductName(),
                    event.getQuantity(),
                    event.getTotalAmount(),
                    event.getOrderDate());
        } else {
            log.warn("⚠️ [NOTIFICACIÓN] Orden #{} FALLIDA para '{}' — Estado: {} — Producto: '{}' — {}",
                    event.getOrderId(),
                    event.getUsername(),
                    event.getStatus(),
                    event.getProductName(),
                    event.getOrderDate());
        }
    }
}
