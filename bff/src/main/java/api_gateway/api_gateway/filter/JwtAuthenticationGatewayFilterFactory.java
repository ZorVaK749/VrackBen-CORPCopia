package api_gateway.api_gateway.filter;

import api_gateway.api_gateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Arrays;

@Component
public class JwtAuthenticationGatewayFilterFactory
        extends AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    public JwtAuthenticationGatewayFilterFactory() {
        super(Config.class);
    }

    public static class Config {
        private String requiredRole;

        public String getRequiredRole() {
            return requiredRole;
        }

        public void setRequiredRole(String requiredRole) {
            this.requiredRole = requiredRole;
        }
    }

    @Override
    public List<String> shortcutFieldOrder() {
        return Arrays.asList("requiredRole");
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // Verificar si el request tiene el header de autorización
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null) {
                return onError(exchange, "No Authorization header", HttpStatus.UNAUTHORIZED);
            }

            if (authHeader.startsWith("Bearer ")) {
                authHeader = authHeader.substring(7);
            } else {
                return onError(exchange, "Invalid Authorization header", HttpStatus.UNAUTHORIZED);
            }

            try {
                // Validar el token
                jwtUtil.validateToken(authHeader);

                // Validar el rol si está configurado en la ruta
                if (config.getRequiredRole() != null && !config.getRequiredRole().isEmpty()) {
                    List<String> userRoles = jwtUtil.extractRoles(authHeader);
                    if (userRoles == null || !userRoles.contains(config.getRequiredRole())) {
                        return onError(exchange, "Acceso denegado: Se requiere rol " + config.getRequiredRole(), HttpStatus.FORBIDDEN);
                    }
                }

                // Opcionalmente, agregar info del usuario al request para servicios downstream
                String username = jwtUtil.extractUsername(authHeader);
                ServerHttpRequest modifiedRequest = request.mutate()
                        .header("loggedInUser", username)
                        .build();

                return chain.filter(exchange.mutate().request(modifiedRequest).build());

            } catch (Exception e) {
                return onError(exchange, "Invalid token", HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }
}
