package ms_job_orders.job_orders;

import org.springframework.boot.SpringApplication;

public class TestJobOrdersApplication {

	public static void main(String[] args) {
		SpringApplication.from(JobOrdersApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
