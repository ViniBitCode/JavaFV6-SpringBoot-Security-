package com.apisimple._apiconkeycloakoaut2bbdd.torneo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AgregarTorneoDTO(String nombreTorneo,
                               LocalDate fechaComienzo,
                               LocalDate fechaFinalizacion,
                               BigDecimal premioGanador) {
}
