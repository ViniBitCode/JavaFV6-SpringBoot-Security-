package com.apisimple._2practicaapisecurity.exception;

public class EntidadNoEncontradaException extends RuntimeException {
    public EntidadNoEncontradaException(String entidad, String valor) {
        super("No se encontró [" + entidad + "] con valor: [" + valor + "]");
    }

}
