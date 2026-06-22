package ms_catalog.catalog.service;

import ms_catalog.catalog.model.ProductCatalog;
import ms_catalog.catalog.repository.CatalogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CatalogServiceTest {

    @Mock
    private CatalogRepository catalogRepository;

    @InjectMocks
    private CatalogService catalogService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProducts() {
        // Arrange
        ProductCatalog p1 = new ProductCatalog(1L, "SKU1", "Bujía", "Bosch", "Motor", "Bujía platino", 5000.0, 100,
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAyFAxKaZMecIDLvL9v4u2BTzmnrYDmNdWAA&s.jpg");
        ProductCatalog p2 = new ProductCatalog(2L, "SKU2", "Filtro", "Mann", "Motor", "Filtro aceite", 8000.0, 100,
                "https://cdnx.jumpseller.com/oilpro/image/57361570/D_670026-MLC80824747717_112024-O.jpg?1744675651.jpg");
        when(catalogRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        // Act
        List<ProductCatalog> result = catalogService.getAllProducts();

        // Assert
        assertEquals(2, result.size());
        assertEquals("SKU1", result.get(0).getSku());
        verify(catalogRepository, times(1)).findAll();
    }

    @Test
    void testGetProductBySku() {
        // Arrange
        ProductCatalog p1 = new ProductCatalog(1L, "SKU1", "Bujía", "Bosch", "Motor", "Bujía platino", 5000.0, 100, "url1");
        when(catalogRepository.findBySku("SKU1")).thenReturn(java.util.Optional.of(p1));

        // Act
        ProductCatalog result = catalogService.getProductBySku("SKU1");

        // Assert
        assertNotNull(result);
        assertEquals("Bujía", result.getName());
        verify(catalogRepository, times(1)).findBySku("SKU1");
    }

    @Test
    void testGetProductBySku_NotFound_ThrowsException() {
        // Arrange
        when(catalogRepository.findBySku("NOT_FOUND")).thenReturn(java.util.Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            catalogService.getProductBySku("NOT_FOUND");
        });

        assertEquals("Producto no encontrado en catálogo", exception.getMessage());
        verify(catalogRepository, times(1)).findBySku("NOT_FOUND");
    }

    @Test
    void testSaveProduct() {
        // Arrange
        ProductCatalog p1 = new ProductCatalog(null, "SKU3", "Llanta", "Michelin", "Ruedas", "Llanta aro 15", 50000.0, 100,
                "url3");
        ProductCatalog savedProduct = new ProductCatalog(3L, "SKU3", "Llanta", "Michelin", "Ruedas", "Llanta aro 15",
                50000.0, 100, "url3");
        when(catalogRepository.save(p1)).thenReturn(savedProduct);

        // Act
        ProductCatalog result = catalogService.saveProduct(p1);

        // Assert
        assertNotNull(result.getId());
        assertEquals(3L, result.getId());
        assertEquals("SKU3", result.getSku());
        verify(catalogRepository, times(1)).save(p1);
    }
}
