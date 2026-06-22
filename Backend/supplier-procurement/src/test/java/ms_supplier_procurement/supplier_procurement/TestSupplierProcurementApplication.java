package ms_supplier_procurement.supplier_procurement;

import org.springframework.boot.SpringApplication;

public class TestSupplierProcurementApplication {

	public static void main(String[] args) {
		SpringApplication.from(SupplierProcurementApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
