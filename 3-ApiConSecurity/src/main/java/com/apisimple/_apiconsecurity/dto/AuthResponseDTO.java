package com.apisimple._apiconsecurity.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

// Esta annotation me permite asegurarme armar Json de objetos en un orden específico
@JsonPropertyOrder({"username", "message", "jwt", "status"})
public record AuthResponseDTO(String username, String message, String jwt, boolean status) {
}
