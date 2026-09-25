package com.apisimple._apiconkeycloakoaut2bbdd.jugador;

import org.springframework.security.oauth2.jwt.Jwt;

public interface JugadorService {

    public JugadorEntity obtenerOCrear(Jwt jwt);

}
