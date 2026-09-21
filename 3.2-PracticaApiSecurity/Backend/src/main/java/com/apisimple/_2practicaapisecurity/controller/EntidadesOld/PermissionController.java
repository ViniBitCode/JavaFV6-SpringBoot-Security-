package com.apisimple._2practicaapisecurity.controller.EntidadesOld;

import com.apisimple._2practicaapisecurity.model.Permission;
import com.apisimple._2practicaapisecurity.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/permiso")
@PreAuthorize("denyAll()") // Cierro la practica que venia haciendo para pasar a un Login
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @GetMapping("/verlos")
    public ResponseEntity<?> verPermisos() {
        return ResponseEntity.status(HttpStatus.OK).body(permissionService.getPermissions());
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearPermiso(@RequestBody Permission permission) {
        // Este flujo igual lo deberia hacer el Service... ahi se maneja la logica de negocio
        Permission pCreado = permissionService.createPermission(permission);
        return ResponseEntity.status(HttpStatus.CREATED).body("Se creo el permiso " + pCreado.getPermissionName());
    }

    @DeleteMapping("/eliminar/{idPermiso}")
    public ResponseEntity<?> eliminarPermiso(@PathVariable Long idPermiso) {
        Permission pEliminado =  permissionService.deletePermission(idPermiso);
        return ResponseEntity.status(HttpStatus.OK).body("Se elimino el permiso: " + pEliminado.getPermissionName());
    }

    @DeleteMapping("/eliminarlos")
    public ResponseEntity<?> eliminarPermiso() {
        permissionService.deleteAllPermissions();
        return ResponseEntity.status(HttpStatus.OK).body("Se eliminaron los permisos");
    }

}
