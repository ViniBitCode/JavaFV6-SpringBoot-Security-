package com.apisimple._backendsimple.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class Persona {

    private long id_persona;
    private String nombre;
    private String apellido;

}
