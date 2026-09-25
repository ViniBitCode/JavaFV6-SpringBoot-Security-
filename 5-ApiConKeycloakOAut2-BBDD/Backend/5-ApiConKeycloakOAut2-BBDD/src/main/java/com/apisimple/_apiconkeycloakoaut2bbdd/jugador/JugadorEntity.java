package com.apisimple._apiconkeycloakoaut2bbdd.jugador;

import com.apisimple._apiconkeycloakoaut2bbdd.equipo.EquipoEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Entity
@Setter @Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jugador")
public class JugadorEntity {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    private UUID idJugador;

    private String nombre;
    private int posicionJugada;
    private LocalDate fechaNacimiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipo_id")
    private EquipoEntity equipo;

    @Column(name = "keycloak_user_id", unique = true, nullable = false, updatable = false)
    private String keycloakUserId;


}
