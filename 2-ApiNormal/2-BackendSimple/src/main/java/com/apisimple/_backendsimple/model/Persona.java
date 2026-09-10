package com.apisimple._backendsimple.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_persona;

    private String nombre;
    private String apellido;

    @OneToOne
    @JoinColumn (name = "mascota_id_mascota", referencedColumnName = "id_mascota")
    private Mascota mascota;

}
