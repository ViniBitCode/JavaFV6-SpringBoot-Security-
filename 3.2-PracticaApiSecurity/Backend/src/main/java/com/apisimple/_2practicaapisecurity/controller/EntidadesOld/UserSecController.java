package com.apisimple._2practicaapisecurity.controller.EntidadesOld;

import com.apisimple._2practicaapisecurity.model.UserSecurity;
import com.apisimple._2practicaapisecurity.service.UserSecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@PreAuthorize("denyAll()") // Cierro la practica que venia haciendo para pasar a un Login
public class UserSecController {

    @Autowired
    private UserSecService userSecService;

    @PostMapping("/crear")
    public ResponseEntity<String> crearUsuario(@RequestBody UserSecurity user) {
        UserSecurity newUser = userSecService.createUserSec(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("Se creo el usuario: [" + newUser.getUsername() + "]");
    }

//    @GetMapping("/obtener/{idUsuario}")
//    public ResponseEntity<UserSecurity> obtenerUsuario(@PathVariable Long idUsuario) {
//        UserSecurity u = userSecService.getUser(idUsuario);
//        return ResponseEntity.status(HttpStatus.FOUND).body(u);
//    }

    @GetMapping("/obtenerlos")
    public ResponseEntity<List<UserSecurity>> obtenerTodosUsuarios() {
        List<UserSecurity> us = userSecService.getUsers();
        return ResponseEntity.status(HttpStatus.FOUND).body(us);
    }

}
