package com.apisimple._apiconkeycloakoaut2bbdd.partido;

import com.apisimple._apiconkeycloakoaut2bbdd.equipo.EquipoEntity;
import com.apisimple._apiconkeycloakoaut2bbdd.torneo.TorneoEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Setter @Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "partido")
public class PartidoEntity {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    private UUID idPartido;

    private LocalDateTime fechaPartido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipo_local_id", nullable = false)
    private EquipoEntity equipoLocal;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipo_visitante_id", nullable = false)
    private EquipoEntity equipoVisitante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "torneo_id", nullable = false)
    private TorneoEntity torneo;

    private Integer golesLocal; // El primitivo de Int me permite el valor null, esto mas adealante se va a reflejar en el front
    private Integer golesVisitante;

}
