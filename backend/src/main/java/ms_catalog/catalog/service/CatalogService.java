package ms_catalog.catalog.service;

import ms_catalog.catalog.model.ProductCatalog;
import ms_catalog.catalog.repository.CatalogRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

/**
 * Servicio que gestiona el catálogo de productos VraKBen (versión Lite).
 *
 * <p>CAMBIOS vs versión original:</p>
 * <ul>
 *   <li>Se eliminaron todas las anotaciones {@code @Cacheable} y {@code @CacheEvict}
 *       (dependían de Redis, que ya no forma parte de esta versión)</li>
 *   <li>La base de datos ahora es H2 en memoria (sin PostgreSQL)</li>
 *   <li>Los datos iniciales se cargan desde {@code data.sql} al arrancar</li>
 * </ul>
 */
@Service
public class CatalogService {

    private final CatalogRepository repository;

    /**
     * Directorio base donde se guardan las imágenes de los productos.
     * En Fargate apunta a /tmp (efímero — se pierde al reiniciar).
     */
    @Value("${catalog.upload.dir:/tmp/catalog-uploads}")
    private String uploadDir;

    /**
     * URL base del servidor para construir la URL pública de la imagen.
     */
    @Value("${catalog.server.url:http://localhost:80}")
    private String serverUrl;

    public CatalogService(CatalogRepository repository) {
        this.repository = repository;
    }

    /**
     * Retorna todos los productos del catálogo.
     * (Sin caché Redis — acceso directo a H2 en memoria, latencia despreciable)
     *
     * @return Lista de todos los productos disponibles.
     */
    public List<ProductCatalog> getAllProducts() {
        return repository.findAll();
    }

    public ProductCatalog getProductBySku(String sku) {
        return repository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado en catálogo"));
    }

    /**
     * Guarda un producto nuevo en el catálogo.
     *
     * @param product El producto a guardar.
     * @return El producto persistido con su ID generado.
     */
    public ProductCatalog saveProduct(ProductCatalog product) {
        return repository.save(product);
    }

    /**
     * Actualiza un producto existente en el catálogo.
     *
     * @param sku         SKU del producto a actualizar.
     * @param updatedData Nuevos datos.
     * @return El producto actualizado.
     */
    public ProductCatalog updateProduct(String sku, ProductCatalog updatedData) {
        ProductCatalog existing = repository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado en catálogo"));

        existing.setName(updatedData.getName());
        existing.setBrand(updatedData.getBrand());
        existing.setCategory(updatedData.getCategory());
        existing.setDescription(updatedData.getDescription());
        existing.setPrice(updatedData.getPrice());
        existing.setStock(updatedData.getStock());

        return repository.save(existing);
    }

    /**
     * Sube una imagen para un producto identificado por su SKU.
     * Guarda el archivo en el sistema de archivos local (/tmp en Fargate — efímero)
     * y actualiza el campo imageUrl en la BD.
     *
     * <p>NOTA: En Fargate el almacenamiento es efímero. Las imágenes subidas
     * se perderán al reiniciar el contenedor. Para persistencia real,
     * migrar a S3.</p>
     *
     * @param sku       El SKU del producto al que pertenece la imagen.
     * @param imageFile El archivo de imagen enviado como multipart/form-data.
     * @return El producto actualizado con la nueva URL de imagen.
     * @throws RuntimeException si el producto no existe o falla la escritura del archivo.
     */
    public ProductCatalog uploadImage(String sku, MultipartFile imageFile) throws IOException {
        ProductCatalog product = repository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con SKU: " + sku));

        // Crear directorio si no existe
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generar nombre único para el archivo
        String originalFilename = imageFile.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : ".jpg";
        String newFilename = "product-" + sku + "-" + UUID.randomUUID().toString().substring(0, 8) + extension;

        // Guardar archivo en disco
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Actualizar la URL en la BD
        String imageUrl = serverUrl + "/images/" + newFilename;
        product.setImageUrl(imageUrl);
        return repository.save(product);
    }

    /**
     * Elimina un producto del catálogo por su SKU.
     *
     * @param sku El SKU del producto a eliminar.
     */
    public void deleteProductBySku(String sku) {
        ProductCatalog product = repository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado en catálogo"));
        repository.delete(product);
    }

    /**
     * Reduce el stock de un producto dado su ID.
     *
     * @param id       ID del producto.
     * @param quantity Cantidad a reducir.
     */
    public void reduceStock(Long id, Integer quantity) {
        ProductCatalog product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (product.getStock() < quantity) {
            throw new RuntimeException("Stock insuficiente para el producto: " + product.getName());
        }

        product.setStock(product.getStock() - quantity);
        repository.save(product);
    }
}