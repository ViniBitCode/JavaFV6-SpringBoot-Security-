package com.apisimple._2practicaapisecurity.exception;

public class NoHayEntidadesException extends RuntimeException {
    public NoHayEntidadesException(String valor) {
        super("No hay [" + valor + "] en la BBDD para eliminar/traer");
    }
}
