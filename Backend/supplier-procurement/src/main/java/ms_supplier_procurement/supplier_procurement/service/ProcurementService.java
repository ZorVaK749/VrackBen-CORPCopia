package ms_supplier_procurement.supplier_procurement.service;

import ms_supplier_procurement.supplier_procurement.model.SupplierOrder;
import ms_supplier_procurement.supplier_procurement.repository.ProcurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ProcurementService {
    @Autowired
    private ProcurementRepository repository;

    public SupplierOrder createPurchaseOrder(SupplierOrder order) {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        return repository.save(order);
    }

    public SupplierOrder updateOrderStatus(Long id, String newStatus) {
        SupplierOrder order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden de compra no encontrada"));
        order.setStatus(newStatus);
        return repository.save(order);
    }

    public java.util.List<SupplierOrder> getAllOrders() {
        return repository.findAll();
    }
}
