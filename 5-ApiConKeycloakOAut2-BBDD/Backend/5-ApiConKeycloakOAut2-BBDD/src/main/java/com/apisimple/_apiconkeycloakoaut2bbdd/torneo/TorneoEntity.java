package com.apisimple._apiconkeycloakoaut2bbdd.torneo;

import com.apisimple._apiconkeycloakoaut2bbdd.equipo.EquipoEntity;
import com.apisimple._apiconkeycloakoaut2bbdd.partido.PartidoEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "torneo")
public class TorneoEntity {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    private UUID idTorneo;

    @Column(unique = true, nullable = false)
    private String nombreTorneo;

    private LocalDate fechaComienzo;
    private LocalDate fechaFinalizacion;

    @Column(precision = 12, scale = 2)
    private BigDecimal premioGanador; // Por lo visto para la plata se usa BigDecimal

    @ManyToMany(mappedBy = "torneosInscriptos")
    private Set<EquipoEntity> equiposInscriptos = new HashSet<>();

    @OneToMany(mappedBy = "torneo")
    private List<PartidoEntity> partidos = new ArrayList<>();
}
