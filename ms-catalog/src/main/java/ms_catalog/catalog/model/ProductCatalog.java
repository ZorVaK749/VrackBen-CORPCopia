package ms_catalog.catalog.model;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

/**
 * Entidad JPA que representa un producto en el catálogo de repuestos VraKBen.
 * Implementa {@link Serializable} para permitir la serialización en caché Redis.
 */
@Entity
@Table(name = "catalog_products")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ProductCatalog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String sku;
    private String name;
    private String brand;
    private String category;

    @Column(length = 500)
    private String description;

    private Double price;
    private Integer stock;

    // --- NUEVO CAMPO PARA LA IMAGEN ---
    private String imageUrl;
}