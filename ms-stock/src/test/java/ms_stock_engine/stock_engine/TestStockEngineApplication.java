package ms_stock_engine.stock_engine;

import org.springframework.boot.SpringApplication;

public class TestStockEngineApplication {

	public static void main(String[] args) {
		SpringApplication.from(StockEngineApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
