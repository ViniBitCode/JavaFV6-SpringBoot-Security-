package com.apisimple._backendsimple.service;

import com.apisimple._backendsimple.model.Persona;
import com.apisimple._backendsimple.repository.IPersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
// Funciones de operaciones sobre la persona
public class PersonaService implements IPersonaService {

    @Autowired
    private IPersonaRepository personaRepo;

    @Override
    public void crearPersona(Persona persona) {
        personaRepo.save(persona);
    }

    @Override
    public void deletePersona(Long id) {
        personaRepo.deleteById(id);
    }

    @Override
    public void editarPersona(Long id, String nombre, String apellido) {
        Persona persona = this.findPersona(id);
        persona.setApellido(apellido);
        persona.setNombre(nombre);
        this.crearPersona(persona);
    }

    @Override
    public List<Persona> traerPersonas() {
        return personaRepo.findAll();
    }

    @Override
    public Persona findPersona(Long id) {
        return personaRepo.findById(id).orElse(null);
    }


}
