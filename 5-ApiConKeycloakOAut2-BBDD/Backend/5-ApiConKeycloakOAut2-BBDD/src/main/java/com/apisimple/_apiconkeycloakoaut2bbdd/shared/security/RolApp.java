package com.apisimple._apiconkeycloakoaut2bbdd.shared.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

public enum RolApp {
    ADMIN("user_role_admin"),
    USER("user_role_user");

    private final String rolKeycloak;

    RolApp(String rolKeycloak) {
        this.rolKeycloak = rolKeycloak;
    }

    public static Optional<RolApp> desdeKeycloak(String nombre) {
        return Arrays.stream(values())
                .filter(r -> r.rolKeycloak.equals(nombre))
                .findFirst();
    }

    public static String principal(Collection<? extends GrantedAuthority> authorities) {
        Set<String> nombres = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
        return Arrays.stream(values())
                .map(Enum::name)
                .filter(nombre -> nombres.contains("ROLE_" + nombre))
                .findFirst()
                .orElse("SIN_ROL");
    }

}
