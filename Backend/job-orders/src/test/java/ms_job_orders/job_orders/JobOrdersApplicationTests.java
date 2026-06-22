package ms_job_orders.job_orders;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class JobOrdersApplicationTests {

	@Test
	void contextLoads() {
	}

}
