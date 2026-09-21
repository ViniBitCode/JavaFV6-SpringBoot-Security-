package com.apisimple._2practicaapisecurity.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntidadNoEncontradaException.class)
    public ResponseEntity<String> entityNotFound(EntidadNoEncontradaException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(ValorYaExisteException.class)
    public ResponseEntity<String> entityDuplicated(ValorYaExisteException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(NoHayEntidadesException.class)
    public ResponseEntity<String> thereAreNotEntities(NoHayEntidadesException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(RolNoTienePermisosException.class)
    public ResponseEntity<String> rolWithoutPermissions(RolNoTienePermisosException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(UsuarioSinRolException.class)
    public ResponseEntity<String> userWithoutRole(UsuarioSinRolException e) {
        return ResponseEntity.status((HttpStatus.CONFLICT)).body(e.getMessage());
    }

    // Esta es una excepcion que trae Spring Security sola.
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> credencialesInvalidas(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
    }

    @ExceptionHandler(OperacionNoPermitidaException.class)
    public ResponseEntity<String> opNoPermitida(OperacionNoPermitidaException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
}
