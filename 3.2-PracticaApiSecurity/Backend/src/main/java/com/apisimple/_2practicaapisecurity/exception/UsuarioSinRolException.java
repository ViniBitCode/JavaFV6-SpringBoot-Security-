package com.apisimple._2practicaapisecurity.exception;

public class UsuarioSinRolException extends RuntimeException {
    public UsuarioSinRolException() {
        super("El usuario debe tener un rol asociado.");
    }
}
