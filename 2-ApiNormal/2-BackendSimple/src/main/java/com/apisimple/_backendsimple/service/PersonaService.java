package com.apisimple._backendsimple.service;

import com.apisimple._backendsimple.model.Persona;
import com.apisimple._backendsimple.repository.IPersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
// Funciones de operaciones sobre la persona
public class PersonaService implements IPersonaService{

    @Autowired
    private IPersonaRepository personaRepo;

    @Override
    public void crearPersona(Persona persona) {
        System.out.println("Se crea la persona");
    }

    @Override
    public List<Persona> traerPersonas() {

        List<Persona> listaPersonas = new ArrayList<Persona>();

        listaPersonas.add(new Persona(1L, "Nombre1", "apellido1"));
        listaPersonas.add(new Persona(2L, "Nombre2", "apellido2"));
        listaPersonas.add(new Persona(3L, "Nombre3", "apellido3"));

        return listaPersonas;

    }


}
