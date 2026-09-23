package com.apisimple._apiconkeycloak.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValorNotFoundException.class)
    public ResponseEntity<String> valorNotFound(ValorNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(ValorYaExisteException.class)
    public ResponseEntity<String> valorYaExiste(ValorYaExisteException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    // Esta es una excepcion que trae Spring Security sola.
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> credencialesInvalidas(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
    }
}
