package com.apisimple._2practicaapisecurity.exception;

public class ValorYaExisteException extends RuntimeException {
    public ValorYaExisteException(String valor) {
        super("El Valor [" + valor + "] ya existe");
    }
}
