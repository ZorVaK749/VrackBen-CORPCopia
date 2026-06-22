package ms_appointment_scheduler.appointment_scheduler.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ms-stock-engine")
public interface StockClient {
    @PostMapping("/api/stock/reduce/{id}")
    void reduceStock(@PathVariable("id") Long id, @RequestParam("quantity") Integer quantity);
}
