package ms_catalog.catalog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Configuración para servir archivos estáticos (imágenes de productos)
 * almacenados en el disco local.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${catalog.upload.dir:uploads/images}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convierte la ruta relativa a absoluta
        Path uploadPath = Paths.get(uploadDir);
        String absoluteUploadPath = uploadPath.toFile().getAbsolutePath();

        // Expone el directorio bajo la ruta /images/**
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + absoluteUploadPath + "/");
    }
}
