package ms_vehicle_history.vehicle_history;

import org.springframework.boot.SpringApplication;

public class TestVehicleHistoryApplication {

	public static void main(String[] args) {
		SpringApplication.from(VehicleHistoryApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
