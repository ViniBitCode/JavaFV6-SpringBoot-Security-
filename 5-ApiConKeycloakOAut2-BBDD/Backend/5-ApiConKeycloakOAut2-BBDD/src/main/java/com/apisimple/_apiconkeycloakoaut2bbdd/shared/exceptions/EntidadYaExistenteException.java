package com.apisimple._apiconkeycloakoaut2bbdd.shared.exceptions;

public class EntidadYaExistenteException extends RuntimeException {
    public EntidadYaExistenteException(String entidad, String valor) {
        super("Ya existe un " + entidad + " con el nombre " + valor);
    }
}
