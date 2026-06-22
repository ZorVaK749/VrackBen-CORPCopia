package ms_job_orders.job_orders.controller;

import ms_job_orders.job_orders.model.JobOrder;
import ms_job_orders.job_orders.service.JobOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import ms_job_orders.job_orders.dto.JobOrderRequestDTO;
import ms_job_orders.job_orders.dto.JobOrderResponseDTO;

@RestController
@RequestMapping("/api/job-orders")
public class JobOrderController {
    @Autowired
    private JobOrderService service;

    /** Lista todas las órdenes de trabajo registradas en la BD */
    @GetMapping("/all")
    public List<JobOrderResponseDTO> getAllOrders() {
        return service.getAllOrders().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/start")
    public JobOrderResponseDTO startJob(@RequestBody JobOrderRequestDTO request) {
        JobOrder order = new JobOrder();
        order.setVehicleVin(request.getVehicleVin());
        order.setMechanicId(request.getMechanicId());
        order.setDescription(request.getDescription());
        order.setLaborCost(request.getLaborCost());
        
        JobOrder savedOrder = service.createOrder(order);
        return convertToDTO(savedOrder);
    }

    @PutMapping("/complete/{id}")
    public JobOrderResponseDTO finishJob(@PathVariable Long id) {
        JobOrder completedOrder = service.completeOrder(id);
        return convertToDTO(completedOrder);
    }
    
    private JobOrderResponseDTO convertToDTO(JobOrder order) {
        return new JobOrderResponseDTO(
                order.getId(),
                order.getVehicleVin(),
                order.getMechanicId(),
                order.getDescription(),
                order.getStartTime(),
                order.getEndTime(),
                order.getStatus(),
                order.getLaborCost()
        );
    }
}