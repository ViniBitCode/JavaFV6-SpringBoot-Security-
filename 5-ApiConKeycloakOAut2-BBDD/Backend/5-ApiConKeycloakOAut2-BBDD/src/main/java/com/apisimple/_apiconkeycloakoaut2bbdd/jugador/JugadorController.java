package com.apisimple._apiconkeycloakoaut2bbdd.jugador;

import com.apisimple._apiconkeycloakoaut2bbdd.jugador.dto.JugadorSesionDTO;
import com.apisimple._apiconkeycloakoaut2bbdd.shared.security.RolApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/panel")
public class JugadorController {

    @Autowired
    private JugadorService jugadorService;

    @GetMapping("/me")
    public ResponseEntity<JugadorSesionDTO> me(@AuthenticationPrincipal Jwt jwt, Authentication auth) {
        JugadorEntity jugador = jugadorService.obtenerOCrear(jwt);
        String rol = RolApp.principal(auth.getAuthorities());
        return ResponseEntity.ok(new JugadorSesionDTO(jugador.getNombre(), rol));
    }
}
