package com.apisimple._apiconkeycloakoaut2bbdd.torneo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TorneoRepository extends JpaRepository<TorneoEntity, UUID> {
    boolean existsByNombreTorneo(String nombreNuevoTorneo);
}
