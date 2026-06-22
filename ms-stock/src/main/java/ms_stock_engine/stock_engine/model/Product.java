package ms_stock_engine.stock_engine.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String sku; // Código único de repuesto
    private Integer stock;
    private Integer minThreshold; // Para evitar quiebres de stock críticos
}