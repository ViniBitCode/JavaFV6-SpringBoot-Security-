package com.apisimple._apiconkeycloakoaut2bbdd.equipo;

import com.apisimple._apiconkeycloakoaut2bbdd.jugador.JugadorEntity;
import com.apisimple._apiconkeycloakoaut2bbdd.partido.PartidoEntity;
import com.apisimple._apiconkeycloakoaut2bbdd.torneo.TorneoEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "equipo")
public class EquipoEntity {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    private UUID idEquipo;

    @Column(unique = true, nullable = false)
    private String nombreEquipo;
    private Date fechaCreacion;

    @OneToMany(mappedBy = "equipo") // El valor del mappedBy siempre coincide con el puesto en la otra clase!
    private List<JugadorEntity> jugadores = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "torneo_inscripto",
            joinColumns = @JoinColumn(name = "id_equipo"),
            inverseJoinColumns = @JoinColumn(name = "id_torneo"))
    private Set<TorneoEntity> torneosInscriptos = new HashSet<>();
}
