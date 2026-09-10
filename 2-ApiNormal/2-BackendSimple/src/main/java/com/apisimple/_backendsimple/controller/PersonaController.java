package com.apisimple._backendsimple.controller;

import com.apisimple._backendsimple.model.Persona;
import com.apisimple._backendsimple.service.IPersonaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PersonaController {

    @Autowired
    private IPersonaService personaService;

    @GetMapping("/personas/traer")
    public List<Persona> getPersonas() {
        return personaService.traerPersonas();
    }

    @PostMapping ("personas/crear")
    public String savePersona(@RequestBody Persona persona) {
        personaService.crearPersona(persona);
        return "La persona fue creada"; // Aunque esto deberia ser un status code!
    }

    @DeleteMapping("personas/borrar/{id}")
    public String deletePersona(@PathVariable Long id) {
        personaService.deletePersona(id);
        return "Se elimino la persona";
    }

    @PutMapping("/personas/editar/{id}")
    public Persona editPersona(@PathVariable Long id,
                               @RequestParam(required = false, name = "nombre") String newName,
                               @RequestParam(required = false, name = "apellido") String newLastName) {

        personaService.editarPersona(id, newName, newLastName);

        return personaService.findPersona(id);

    }


}
