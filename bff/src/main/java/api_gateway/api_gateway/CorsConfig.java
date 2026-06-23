package api_gateway.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // Permite cualquier frontend (Load Balancer, localhost, etc.)
        corsConfig.setAllowedOriginPatterns(List.of("*"));

        // Métodos HTTP permitidos
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Headers permitidos en la petición
        corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));

        // Permite cookies y credenciales
        corsConfig.setAllowCredentials(true);

        // Tiempo que el browser cachea la respuesta pre-flight (en segundos)
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
