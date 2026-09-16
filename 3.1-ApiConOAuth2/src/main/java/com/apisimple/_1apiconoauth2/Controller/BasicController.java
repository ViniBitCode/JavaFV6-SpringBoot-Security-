package com.apisimple._1apiconoauth2.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("denyAll()")
public class BasicController {

    @GetMapping("/hola")
    @PreAuthorize("permitAll()")
    public String decirHola() {
        return "Hola, este Endpoint no tiene seguridad";
    }

    @GetMapping("/holaSec")
    @PreAuthorize("isAuthenticated()") // Debemos usar esta annotation para que se meta estando autenticado
    public String decirHolaSec() {
        return "Hola, este Endpoint que tiene seguridad";
    }

}
