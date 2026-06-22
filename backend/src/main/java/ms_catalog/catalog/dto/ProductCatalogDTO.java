package ms_catalog.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalogDTO {
    private Long id;
    private String sku;
    private String name;
    private String brand;
    private String category;
    private String description;
    private Double price;
    private Integer stock;
    private String imageUrl;
}
