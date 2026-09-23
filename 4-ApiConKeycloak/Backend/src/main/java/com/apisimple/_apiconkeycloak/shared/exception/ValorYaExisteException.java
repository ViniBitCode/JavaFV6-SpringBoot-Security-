package com.apisimple._apiconkeycloak.shared.exception;

public class ValorYaExisteException extends RuntimeException {
    public ValorYaExisteException(String campo, String valor) {
        super("Ya existe un [" + campo + "] con el valor [" + valor + "]");
    }
}
