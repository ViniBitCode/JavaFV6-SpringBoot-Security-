package com.apisimple._apiconsecurity.controller.basicos;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("denyAll()") // Se deniega t0do acceso sin autentificar
public class HolaMundo {

    @GetMapping("/holaSeg")
    @PreAuthorize("hasAuthority('READ')") // Todos los que tienen permiso de lectura pueden entrar
    public String secHolaMundo() {
        return "Hola Mundo con Security";
    }

    @GetMapping("/holaNoSeg")
    @PreAuthorize("permitAll()")
    public String noSecHolaMundo() {
        return "Hola Mundo sin Security";
    }

    @GetMapping("/holaNoSegSinAnnotation") //
    public String noSecAnnotationHolaMundo() {
        return "Hola Mundo con seguridad debido al denyall de arriba de todo";
    }
}
