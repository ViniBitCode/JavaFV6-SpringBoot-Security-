package com.apisimple._backendsimple.service;

import com.apisimple._backendsimple.model.Persona;

import java.util.List;

public interface IPersonaService {

    public void crearPersona(Persona persona);
    public List<Persona> traerPersonas();


}
