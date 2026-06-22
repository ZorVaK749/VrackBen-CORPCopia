package ms_catalog.catalog.repository;

import ms_catalog.catalog.model.ProductCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CatalogRepository extends JpaRepository<ProductCatalog, Long> {
    Optional<ProductCatalog> findBySku(String sku);
    List<ProductCatalog> findByCategory(String category);
}