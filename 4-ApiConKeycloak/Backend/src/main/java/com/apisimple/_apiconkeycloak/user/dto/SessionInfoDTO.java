package com.apisimple._apiconkeycloak.user.dto;

import com.apisimple._apiconkeycloak.role.RoleEntity;

public record SessionInfoDTO(String username, String role) { }
