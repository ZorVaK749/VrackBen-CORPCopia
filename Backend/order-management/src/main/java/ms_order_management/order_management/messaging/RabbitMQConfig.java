package ms_order_management.order_management.messaging;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de RabbitMQ para el flujo de notificación de órdenes.
 *
 * <p>Topología:</p>
 * <pre>
 *   OrderService  ──publish──►  vrakben.exchange  ──routing key: order.completed──►  vrakben.orders.queue
 *                                                                                         │
 *                                                                              OrderNotificationListener
 *                                                                              (simula envío de email)
 * </pre>
 */
@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "vrakben.exchange";
    public static final String QUEUE_NAME    = "vrakben.orders.queue";
    public static final String ROUTING_KEY   = "order.completed";

    /**
     * Exchange de tipo Topic para enrutar eventos de órdenes.
     * Durable = true → sobrevive reinicios del broker.
     */
    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange(EXCHANGE_NAME, true, false);
    }

    /**
     * Cola donde llegan los eventos de órdenes completadas.
     * Durable = true → sobrevive reinicios del broker.
     */
    @Bean
    public Queue orderQueue() {
        return new Queue(QUEUE_NAME, true);
    }

    /**
     * Binding que conecta la cola al exchange con la routing key "order.completed".
     */
    @Bean
    public Binding orderBinding(Queue orderQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(orderQueue).to(orderExchange).with(ROUTING_KEY);
    }
}
