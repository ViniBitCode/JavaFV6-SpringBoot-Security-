package com.apisimple._apiconkeycloakoaut2bbdd.jugador;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JugadorServiceImp implements JugadorService{


    private final JugadorRepository jugadorRepository;

    public JugadorServiceImp(JugadorRepository jugadorRepository) {
        this.jugadorRepository = jugadorRepository;
    }

    @Override
    @Transactional
    public JugadorEntity obtenerOCrear(Jwt jwt) {
        return jugadorRepository.findByKeycloakUserId(jwt.getSubject())
                .orElseGet(() -> {
                    JugadorEntity nuevoJugador = new JugadorEntity();
                    nuevoJugador.setKeycloakUserId(jwt.getSubject());
                    nuevoJugador.setNombre(jwt.getClaimAsString("preferred_username"));
                    return jugadorRepository.save(nuevoJugador);
                });
    }
}

