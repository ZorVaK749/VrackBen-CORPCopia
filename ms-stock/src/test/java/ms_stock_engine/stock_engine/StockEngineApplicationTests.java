package ms_stock_engine.stock_engine;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class StockEngineApplicationTests {

	@Test
	void contextLoads() {
	}

}
