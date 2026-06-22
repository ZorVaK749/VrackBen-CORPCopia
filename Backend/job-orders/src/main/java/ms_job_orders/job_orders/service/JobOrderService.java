package ms_job_orders.job_orders.service;

import ms_job_orders.job_orders.model.JobOrder;
import ms_job_orders.job_orders.repository.JobOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class JobOrderService {
    @Autowired
    private JobOrderRepository repository;

    public JobOrder createOrder(JobOrder order) {
        order.setStartTime(LocalDateTime.now());
        order.setStatus("IN_PROGRESS");
        return repository.save(order);
    }

    public JobOrder completeOrder(Long id) {
        JobOrder order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        order.setEndTime(LocalDateTime.now());
        order.setStatus("COMPLETED");
        return repository.save(order);
    }

    /** Devuelve todas las órdenes de trabajo registradas */
    public java.util.List<JobOrder> getAllOrders() {
        return repository.findAll();
    }
}
