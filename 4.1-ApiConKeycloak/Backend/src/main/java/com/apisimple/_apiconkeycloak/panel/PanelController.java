package com.apisimple._apiconkeycloak.panel;

import com.apisimple._apiconkeycloak.panel.dto.PerfilDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/panel")
public class PanelController {

    private static final List<String> JERARQUIA_ROLES = List.of("ADMIN", "USER");

    @GetMapping("/me")
    public ResponseEntity<PerfilDTO> me(@AuthenticationPrincipal Jwt jwt, Authentication auth) {
        Set<String> authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String rol = JERARQUIA_ROLES.stream()
                .filter(r -> authorities.contains("ROLE_" + r))
                .findFirst()
                .orElse("USER");

        return ResponseEntity.ok(new PerfilDTO(
                jwt.getClaimAsString("preferred_username"),
                jwt.getClaimAsString("email"),
                rol));
    }
}
