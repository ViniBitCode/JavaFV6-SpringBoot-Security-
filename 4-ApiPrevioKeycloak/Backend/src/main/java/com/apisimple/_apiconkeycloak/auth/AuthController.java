package com.apisimple._apiconkeycloak.auth;

import com.apisimple._apiconkeycloak.role.RoleEntity;
import com.apisimple._apiconkeycloak.role.RoleService;
import com.apisimple._apiconkeycloak.shared.security.jwt.JwtService;
import com.apisimple._apiconkeycloak.user.UserEntity;
import com.apisimple._apiconkeycloak.user.UserRepository;
import com.apisimple._apiconkeycloak.user.UserService;
import com.apisimple._apiconkeycloak.user.dto.LoginInfoDTO;
import com.apisimple._apiconkeycloak.user.dto.RegisterInfoDTO;
import com.apisimple._apiconkeycloak.user.dto.RegisterResponseDTO;
import com.apisimple._apiconkeycloak.user.dto.SessionInfoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("login")
    public ResponseEntity<SessionInfoDTO> authLogin(@RequestBody LoginInfoDTO loginInfoDTO) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginInfoDTO.username(),
                        loginInfoDTO.password()));

        String role = "USER";
        for (GrantedAuthority a : auth.getAuthorities()) {
            if (Objects.requireNonNull(a.getAuthority()).startsWith("ROLE_")) {
                role = a.getAuthority().substring(5);   // ROLE_ADMIN -> ADMIN
                break;
            }
        }
        String token = jwtService.createToken(auth);

        return ResponseEntity.ok(new SessionInfoDTO(auth.getName(), role, token));
    }

    @PostMapping("register")
    public ResponseEntity<RegisterResponseDTO> authRegister(@RequestBody RegisterInfoDTO registerInfoDTO) {

        UserEntity userEntity = new UserEntity();

        userEntity.setEmail(registerInfoDTO.email());
        userEntity.setUsername(registerInfoDTO.username());
        userEntity.setPassword(registerInfoDTO.password());

        RoleEntity role = roleService.getRole("USER");
        userEntity.setRole(role);

        userService.crearUsuario(userEntity);

        return ResponseEntity.status(HttpStatus.CREATED).body(new RegisterResponseDTO(registerInfoDTO.username()));

    }

}
