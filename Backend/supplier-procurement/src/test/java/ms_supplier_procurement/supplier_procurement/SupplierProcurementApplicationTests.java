package ms_supplier_procurement.supplier_procurement;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Test de integración: requiere PostgreSQL real o Testcontainers. Tests unitarios en ProcurementServiceTest.")
class SupplierProcurementApplicationTests {

	@Test
	void contextLoads() {
	}

}

