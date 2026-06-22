package ms_catalog.catalog.service;

import ms_catalog.catalog.model.ProductCatalog;
import ms_catalog.catalog.repository.CatalogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
 * Servicio que gestiona el catálogo de productos VraKBen.
 * Incluye operaciones CRUD, caché Redis y la subida de imágenes al almacenamiento local.
 *
 * <p>El método {@link #getAllProducts()} está cacheado en Redis con la clave "catalog::all".
 * Cada operación de escritura ({@link #saveProduct}, {@link #uploadImage}) invalida dicho caché
 * garantizando que el cliente siempre vea datos consistentes.</p>
 */
@Service
public class CatalogService {

    @Autowired
    private CatalogRepository repository;

    /**
     * Directorio base donde se guardan las imágenes de los productos.
     * Se puede sobreescribir con la variable de entorno CATALOG_UPLOAD_DIR.
     */
    @Value("${catalog.upload.dir:uploads/images}")
    private String uploadDir;

    /**
     * URL base del servidor para construir la URL pública de la imagen.
     */
    @Value("${catalog.server.url:http://localhost:8084}")
    private String serverUrl;

    /**
     * Retorna todos los productos del catálogo.
     * El resultado se almacena en Redis con la clave "catalog::all" para evitar
     * consultas repetidas a la base de datos en peticiones frecuentes.
     *
     * @return Lista de todos los productos disponibles.
     */
    @Cacheable(value = "catalog", key = "'all'")
    public List<ProductCatalog> getAllProducts() {
        return repository.findAll();
    }

    public ProductCatalog getProductBySku(String sku) {
        return repository.findBySku(sku).orElseThrow(() -> new RuntimeException("Producto no encontrado en catálogo"));
    }

    /**
     * Guarda un producto nuevo o actualiza uno existente.
     * Invalida la entrada de caché "catalog::all" para que la siguiente
     * consulta al listado refleje el nuevo producto.
     *
     * @param product El producto a guardar.
     * @return El producto persistido con su ID generado.
     */
    @CacheEvict(value = "catalog", key = "'all'")
    public ProductCatalog saveProduct(ProductCatalog product) {
        return repository.save(product);
    }

    /**
     * Actualiza un producto existente en el catálogo.
     *
     * @param sku SKU del producto a actualizar.
     * @param updatedData Nuevos datos.
     * @return El producto actualizado.
     */
    @CacheEvict(value = "catalog", key = "'all'")
    public ProductCatalog updateProduct(String sku, ProductCatalog updatedData) {
        ProductCatalog existing = repository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado en catálogo"));
        
        existing.setName(updatedData.getName());
        existing.setBrand(updatedData.getBrand());
        existing.setCategory(updatedData.getCategory());
        existing.setDescription(updatedData.getDescription());
        existing.setPrice(updatedData.getPrice());
        existing.setStock(updatedData.getStock());
        // sku is not updated because it's the identifier, image is updated separately or kept.
        
        return repository.save(existing);
    }

    /**
     * Sube una imagen para un producto identificado por su SKU.
     * Guarda el archivo en el sistema de archivos local y actualiza el campo imageUrl en la BD.
     * Invalida el caché del catálogo para reflejar la nueva imagen.
     *
     * @param sku       El SKU del producto al que pertenece la imagen.
     * @param imageFile El archivo de imagen enviado como multipart/form-data.
     * @return El producto actualizado con la nueva URL de imagen.
     * @throws RuntimeException si el producto no existe o falla la escritura del archivo.
     */
    @CacheEvict(value = "catalog", key = "'all'")
    public ProductCatalog uploadImage(String sku, MultipartFile imageFile) throws IOException {
        ProductCatalog product = repository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con SKU: " + sku));

        // Crear directorio si no existe
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generar nombre ǧnico para el archivo
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
     * Elimina un producto del catǭlogo por su SKU.
     * Invalida el cachǸ del catǭlogo.
     *
     * @param sku El SKU del producto a eliminar.
     */
    @CacheEvict(value = "catalog", key = "'all'")
    public void deleteProductBySku(String sku) {
        ProductCatalog product = repository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado en catǭlogo"));
        repository.delete(product);
    }

    /**
     * Reduce el stock de un producto dado su ID.
     * Invalida el caché para reflejar el cambio en toda la aplicación.
     *
     * @param id ID del producto.
     * @param quantity Cantidad a reducir.
     */
    @CacheEvict(value = "catalog", key = "'all'")
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