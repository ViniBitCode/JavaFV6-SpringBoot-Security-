package com.apisimple._apiconkeycloak.shared.exception;

public class ValorYaExiste extends RuntimeException {
    public ValorYaExiste(String campo, String valor) {
        super("Ya existe un [" + campo + "] con el valor [" + valor + "]");
    }
}
