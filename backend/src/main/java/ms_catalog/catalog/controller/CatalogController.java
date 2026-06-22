package ms_catalog.catalog.controller;

import ms_catalog.catalog.model.ProductCatalog;
import ms_catalog.catalog.service.CatalogService;
import ms_catalog.catalog.dto.ProductCatalogDTO;
import ms_catalog.catalog.dto.ProductCatalogRequestDTO;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST para el catálogo de productos VraKBen.
 * Provee endpoints para listar, crear y actualizar productos del catálogo,
 * incluyendo la subida de imágenes para cada producto.
 */
@RestController
@RequestMapping("/api/catalog")
@Tag(name = "Catalog", description = "API del catálogo de repuestos")
public class CatalogController {

    private final CatalogService service;

    public CatalogController(CatalogService service) {
        this.service = service;
    }

    /**
     * Lista todos los productos disponibles en el catálogo.
     *
     * @return Lista de todos los productos en formato DTO.
     */
    @Operation(summary = "Listar todos los productos", description = "Retorna el catálogo completo de repuestos disponibles.")
    @GetMapping("/all")
    public List<ProductCatalogDTO> listAll() {
        return service.getAllProducts().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca un producto por su SKU único.
     *
     * @param sku El SKU del producto a buscar.
     * @return El producto encontrado o null si no existe.
     */
    @Operation(summary = "Buscar por SKU", description = "Retorna un producto específico por su código SKU.")
    @GetMapping("/{sku}")
    public ProductCatalogDTO getBySku(@PathVariable String sku) {
        ProductCatalog product = service.getProductBySku(sku);
        return (product != null) ? convertToDTO(product) : null;
    }

    /**
     * Crea un nuevo producto en el catálogo.
     *
     * @param request DTO con los datos del producto a registrar.
     * @return El producto creado en formato DTO.
     */
    @Operation(summary = "Crear producto", description = "Registra un nuevo producto en el catálogo.")
    @PostMapping("/create")
    public ProductCatalogDTO create(@RequestBody ProductCatalogRequestDTO request) {
        ProductCatalog product = new ProductCatalog();
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setCategory(request.getCategory());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());

        ProductCatalog savedProduct = service.saveProduct(product);
        return convertToDTO(savedProduct);
    }

    /**
     * Sube o reemplaza la imagen de un producto identificado por SKU.
     * Acepta archivos multipart/form-data (JPEG, PNG, WEBP, etc.).
     *
     * @param sku       El SKU del producto al que se le asigna la imagen.
     * @param imageFile El archivo de imagen a subir.
     * @return El producto actualizado con la nueva URL de imagen, o 400 si ocurre un error.
     */
    @Operation(summary = "Subir imagen de producto", description = "Permite subir una imagen local para un producto del catálogo. Reemplaza la URL previa.")
    @PostMapping(value = "/upload/{sku}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductCatalogDTO> uploadImage(
            @PathVariable String sku,
            @RequestParam("image") MultipartFile imageFile) {
        try {
            ProductCatalog updated = service.uploadImage(sku, imageFile);
            return ResponseEntity.ok(convertToDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualiza un producto existente en el catálogo.
     */
    @Operation(summary = "Actualizar producto", description = "Actualiza la información de un producto dado su SKU.")
    @PutMapping("/update/{sku}")
    public ResponseEntity<ProductCatalogDTO> update(@PathVariable String sku, @RequestBody ProductCatalogRequestDTO request) {
        try {
            ProductCatalog product = new ProductCatalog();
            product.setName(request.getName());
            product.setBrand(request.getBrand());
            product.setCategory(request.getCategory());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setStock(request.getStock());
            
            ProductCatalog updatedProduct = service.updateProduct(sku, product);
            return ResponseEntity.ok(convertToDTO(updatedProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Elimina un producto por su SKU.
     *
     * @param sku El SKU del producto a eliminar.
     * @return 204 No Content si se eliminó con éxito, 400 Bad Request en caso de error.
     */
    @Operation(summary = "Eliminar producto", description = "Elimina un producto del catálogo dado su SKU.")
    @DeleteMapping("/{sku}")
    public ResponseEntity<Void> delete(@PathVariable String sku) {
        try {
            service.deleteProductBySku(sku);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Reduce el stock de un producto por ID.
     */
    @Operation(summary = "Reducir stock", description = "Reduce el stock de un producto dado su ID.")
    @PutMapping("/reduce/{id}")
    public ResponseEntity<Void> reduceStock(@PathVariable Long id, @RequestParam Integer quantity) {
        try {
            service.reduceStock(id, quantity);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private ProductCatalogDTO convertToDTO(ProductCatalog product) {
        return new ProductCatalogDTO(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getBrand(),
                product.getCategory(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl()
        );
    }
}
