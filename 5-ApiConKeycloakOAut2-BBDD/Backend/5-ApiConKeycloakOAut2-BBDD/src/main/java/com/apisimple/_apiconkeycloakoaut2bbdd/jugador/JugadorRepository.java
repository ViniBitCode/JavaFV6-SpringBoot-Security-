package com.apisimple._apiconkeycloakoaut2bbdd.jugador;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JugadorRepository extends JpaRepository<JugadorEntity, UUID> {

    Optional<JugadorEntity> findByKeycloakUserId(String keycloakUserId);

}
