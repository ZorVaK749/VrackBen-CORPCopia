package ms_supplier_procurement.supplier_procurement.repository;

import ms_supplier_procurement.supplier_procurement.model.SupplierOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProcurementRepository extends JpaRepository<SupplierOrder, Long> {
    List<SupplierOrder> findBySupplierName(String supplierName);
    List<SupplierOrder> findByStatus(String status);
}
