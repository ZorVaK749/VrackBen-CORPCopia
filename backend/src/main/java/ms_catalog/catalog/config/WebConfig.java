package ms_catalog.catalog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Configuración Web para la versión Lite de ms-catalog.
 *
 * <p>Combina dos responsabilidades:</p>
 * <ol>
 *   <li><b>CORS</b>: Permite llamadas desde el frontend React desplegado en ECS/ALB.
 *       El origen permitido se configura vía variable de entorno {@code FRONTEND_ORIGIN}
 *       (default: * para desarrollo local).</li>
 *   <li><b>Archivos estáticos</b>: Expone el directorio de imágenes bajo {@code /images/**}.</li>
 * </ol>
 *
 * <p>En ECS Fargate, configurar la variable de entorno:</p>
 * <pre>FRONTEND_ORIGIN=http://&lt;alb-del-frontend&gt;</pre>
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${catalog.upload.dir:/tmp/catalog-uploads}")
    private String uploadDir;

    /**
     * Origen permitido para CORS.
     * En producción (ECS): la URL del ALB del frontend.
     * En desarrollo local: * (cualquier origen).
     */
    @Value("${FRONTEND_ORIGIN:*}")
    private String frontendOrigin;

    /**
     * Configura CORS para todos los endpoints de la API.
     * Permite GET, POST, PUT, DELETE y el header Authorization (JWT).
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(frontendOrigin)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }

    /**
     * Expone el directorio de imágenes bajo /images/**.
     * NOTA: En Fargate este directorio es efímero (/tmp).
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir);
        String absoluteUploadPath = uploadPath.toFile().getAbsolutePath();
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + absoluteUploadPath + "/");
    }
}
