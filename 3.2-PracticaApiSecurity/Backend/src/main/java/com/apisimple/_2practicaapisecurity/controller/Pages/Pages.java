package com.apisimple._2practicaapisecurity.controller.Pages;

import com.apisimple._2practicaapisecurity.dto.UserInfoDTO;
import com.apisimple._2practicaapisecurity.exception.OperacionNoPermitidaException;
import com.apisimple._2practicaapisecurity.service.UserSecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@PreAuthorize("isAuthenticated()")
public class Pages {

    @Autowired
    private UserSecService userSecService;

    @GetMapping("/panel")
    public ResponseEntity<List<UserInfoDTO>> obtenerTodosUsuarios() {
        return ResponseEntity.ok(userSecService.getUsersInfo());
    }

    @DeleteMapping("/panel/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminarUsuario(@PathVariable String username, Authentication authentication) {
        // Esto de aca va en Service, pero como quiero terminarlo ya para avanzar con otro ejercicio lo dejo aca :P
        if (username.equals(authentication.getName())) {
            throw new OperacionNoPermitidaException("No podés borrar tu propio usuario");
        }

        userSecService.deleteUser(username);
    }

}
