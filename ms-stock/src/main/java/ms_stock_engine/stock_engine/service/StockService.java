package ms_stock_engine.stock_engine.service;

import ms_stock_engine.stock_engine.model.Product;
import ms_stock_engine.stock_engine.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class StockService {

    @Autowired
    private ProductRepository productRepository;

    /** Devuelve todos los productos del inventario del taller */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /** Busca un producto por su SKU */
    public Product findBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con SKU: " + sku));
    }

    @Transactional
    public Product reduceStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (product.getStock() < quantity) {
            throw new RuntimeException("Stock insuficiente para el producto: " + product.getName());
        }

        product.setStock(product.getStock() - quantity);
        return productRepository.save(product);
    }
}
