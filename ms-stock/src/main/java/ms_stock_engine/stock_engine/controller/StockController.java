package ms_stock_engine.stock_engine.controller;

import ms_stock_engine.stock_engine.model.Product;
import ms_stock_engine.stock_engine.service.StockService;
import ms_stock_engine.stock_engine.dto.ProductResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    @Autowired
    private StockService stockService;

    /** Lista todos los productos del inventario */
    @GetMapping("/all")
    public List<ProductResponseDTO> getAllProducts() {
        return stockService.getAllProducts().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /** Busca un producto por SKU */
    @GetMapping("/sku/{sku}")
    public ResponseEntity<?> getBySku(@PathVariable String sku) {
        try {
            return ResponseEntity.ok(convertToDTO(stockService.findBySku(sku)));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** Descuenta stock de un producto por su ID interno */
    @PostMapping("/reduce/{id}")
    public ResponseEntity<?> reduce(@PathVariable Long id, @RequestParam Integer quantity) {
        try {
            Product updatedProduct = stockService.reduceStock(id, quantity);
            return ResponseEntity.ok(convertToDTO(updatedProduct));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status")
    public String status() {
        return "Stock Engine is UP";
    }

    private ProductResponseDTO convertToDTO(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getStock(),
                product.getMinThreshold()
        );
    }
}

