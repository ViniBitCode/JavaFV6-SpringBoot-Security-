package com.apisimple._backendsimple.service;

import com.apisimple._backendsimple.model.Persona;
import com.apisimple._backendsimple.repository.IPersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface IPersonaService {

    public List<Persona> traerPersonas();

    public Persona findPersona(Long id);

    public void crearPersona(Persona persona);

    public void deletePersona(Long id);

    public void editarPersona(Long id, String nombre, String apellido);
}
