package com.apisimple._apiconkeycloakoaut2bbdd.torneo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ListaTorneosDTO(String nombreTorneo,
                              LocalDate fechaComienzo,
                              LocalDate fechaFinalizacion,
                              BigDecimal premioGanador,
                              int equiposInscriptos) {
}
