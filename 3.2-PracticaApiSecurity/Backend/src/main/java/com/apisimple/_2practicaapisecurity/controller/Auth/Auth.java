package com.apisimple._2practicaapisecurity.controller.Auth;

import com.apisimple._2practicaapisecurity.dto.LoginRequestDTO;
import com.apisimple._2practicaapisecurity.dto.RegisterRequestDTO;
import com.apisimple._2practicaapisecurity.dto.SessionInfoDTO;
import com.apisimple._2practicaapisecurity.model.Role;
import com.apisimple._2practicaapisecurity.model.UserSecurity;
import com.apisimple._2practicaapisecurity.service.UserSecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping("/auth")
@PreAuthorize("permitAll()")
public class Auth {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserSecService userSecService;

    @PostMapping("/login")
    public ResponseEntity<SessionInfoDTO> loguearUsuario(@RequestBody LoginRequestDTO loginRequestDTO) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.username(),
                        loginRequestDTO.password()));

        String role = "USER";
        for (GrantedAuthority a : auth.getAuthorities()) {
            if (Objects.requireNonNull(a.getAuthority()).startsWith("ROLE_")) {
                role = a.getAuthority().substring(5);   // ROLE_ADMIN -> ADMIN
                break;
            }
        }

    return ResponseEntity.ok(new SessionInfoDTO(auth.getName(), role));
    }

    @PostMapping("/register")
    public ResponseEntity<String> registrarUsuario(@RequestBody RegisterRequestDTO registerRequest) {
        UserSecurity nuevo = new UserSecurity();
        nuevo.setUsername(registerRequest.username());
        nuevo.setPassword(registerRequest.password());

        Role role = new Role();
        role.setRoleName("USER");
        nuevo.setRole(role);

        UserSecurity creado = userSecService.createUserSec(nuevo);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado.getUsername());
    }
}