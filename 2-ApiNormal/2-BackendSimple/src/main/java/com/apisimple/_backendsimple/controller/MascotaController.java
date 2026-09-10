package com.apisimple._backendsimple.controller;

import com.apisimple._backendsimple.model.Mascota;
import com.apisimple._backendsimple.service.IMascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MascotaController {

    @Autowired
    private IMascotaService mascotaService;

    @GetMapping("/mascotas/traer")
    public List<Mascota> traerMascotas() {
        return mascotaService.getMascotas();
    }

    @PostMapping("/mascotas/crear")
    public String crearMascota(@RequestBody Mascota m) {
        mascotaService.createMascota(m);
        return "Se creo la mascota";
    }

    @DeleteMapping("/mascotas/borrar/{id}")
    public String eliminarMascota(@PathVariable Long id) {
        mascotaService.deleteMascota(id);
        return "Se elimino la mascota";
    }

    @PutMapping("/mascotas/editar/{id}")
    public Mascota editarMascota(@PathVariable Long id,
                                 @RequestParam(required = false, name = "raza") String newRaza) {
        mascotaService.editMascota(id, newRaza);
        return mascotaService.getMascota(id);

    }

}
