package com.apisimple._apiconkeycloak.shared.exception;

public class ValorNotFoundException extends RuntimeException {
    public ValorNotFoundException(String valor) {
        super("No se encontro [" + valor + "] en la BBDD.");
    }
}
