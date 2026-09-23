package com.apisimple._apiconkeycloak.shared.exception;

public class ValorNotFound extends RuntimeException {
    public ValorNotFound(String valor) {
        super("No se encontro [" + valor + "] en la BBDD.");
    }
}
