package ms_catalog.catalog.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador raíz creado específicamente para que los Target Groups
 * del Application Load Balancer de AWS reciban un código 200 OK
 * al hacer ping a la ruta /.
 */
@RestController
public class RootController {

    @GetMapping("/")
    public String health() {
        return "OK - Backend VraKBen Lite is running!";
    }
}
