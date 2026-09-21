package com.apisimple._2practicaapisecurity.exception;

public class RolNoTienePermisosException extends RuntimeException {
    public RolNoTienePermisosException() {
        super("El rol no tiene asociado permisos, y debe tenerlos");
    }
}
