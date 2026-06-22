package ms_supplier_procurement.supplier_procurement.controller;

import ms_supplier_procurement.supplier_procurement.model.SupplierOrder;
import ms_supplier_procurement.supplier_procurement.service.ProcurementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import ms_supplier_procurement.supplier_procurement.dto.SupplierOrderRequestDTO;
import ms_supplier_procurement.supplier_procurement.dto.SupplierOrderResponseDTO;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/procurement")
public class ProcurementController {
    @Autowired
    private ProcurementService service;

    @PostMapping("/order")
    public SupplierOrderResponseDTO placeOrder(@RequestBody SupplierOrderRequestDTO request) {
        SupplierOrder order = new SupplierOrder();
        order.setMechanicUsername(request.getMechanicUsername());
        order.setWorkOrderId(request.getWorkOrderId());
        order.setPartName(request.getPartName());
        order.setProductSku(request.getSku());
        order.setQuantity(request.getQuantity());
        order.setUrgency(request.getUrgency());
        order.setNotes(request.getNotes());
        order.setOrderDate(java.time.LocalDateTime.now());
        order.setStatus("PENDING");
        
        SupplierOrder savedOrder = service.createPurchaseOrder(order);
        return convertToDTO(savedOrder);
    }

    @PutMapping("/status/{id}")
    public SupplierOrderResponseDTO updateStatus(@PathVariable Long id, @RequestParam String status) {
        SupplierOrder updatedOrder = service.updateOrderStatus(id, status);
        return convertToDTO(updatedOrder);
    }

    @GetMapping("/all")
    public List<SupplierOrderResponseDTO> getAllOrders() {
        return service.getAllOrders().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private SupplierOrderResponseDTO convertToDTO(SupplierOrder order) {
        return new SupplierOrderResponseDTO(
                order.getId(),
                order.getMechanicUsername(),
                order.getWorkOrderId(),
                order.getPartName(),
                order.getProductSku(),
                order.getQuantity(),
                order.getUrgency(),
                order.getNotes(),
                order.getOrderDate(),
                order.getStatus()
        );
    }
}
