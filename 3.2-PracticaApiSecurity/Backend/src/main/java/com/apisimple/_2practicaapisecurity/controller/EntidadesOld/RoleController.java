package com.apisimple._2practicaapisecurity.controller.EntidadesOld;

import com.apisimple._2practicaapisecurity.model.Role;
import com.apisimple._2practicaapisecurity.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rol")
@PreAuthorize("denyAll()") // Cierro la practica que venia haciendo para pasar a un Login
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping("/verlos")
    public ResponseEntity<?> verPermisos() {
        return ResponseEntity.status(HttpStatus.OK).body(roleService.getRoles());
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearPermiso(@RequestBody Role role) {
        // Este flujo igual lo deberia hacer el Service... ahi se maneja la logica de negocio
        Role rCreado = roleService.createRole(role);
        return ResponseEntity.status(HttpStatus.CREATED).body("Se creo el Rol " + rCreado.getRoleName());
    }

    @DeleteMapping("/eliminar/{idRol}")
    public ResponseEntity<?> eliminarPermiso(@PathVariable Long idRol) {
        Role rEliminado = roleService.deleteRole(idRol);
        return ResponseEntity.status(HttpStatus.OK).body("Se elimino el Rol: " + rEliminado.getRoleName());
    }

    @DeleteMapping("/eliminarlos")
    public ResponseEntity<?> eliminarPermiso() {
        roleService.deleteAllPermissions();
        return ResponseEntity.status(HttpStatus.OK).body("Se eliminaron los roles");
    }

}
