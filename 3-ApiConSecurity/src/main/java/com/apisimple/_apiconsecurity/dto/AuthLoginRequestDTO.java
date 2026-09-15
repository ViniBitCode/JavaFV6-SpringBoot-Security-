package com.apisimple._apiconsecurity.dto;


import jakarta.validation.constraints.NotBlank;

// Esto es un record ya que me estandariza los metodos basicos como getters y setters para una clase que tiene datos unicamente
public record AuthLoginRequestDTO(@NotBlank String username,
                                  @NotBlank String password) {


}
