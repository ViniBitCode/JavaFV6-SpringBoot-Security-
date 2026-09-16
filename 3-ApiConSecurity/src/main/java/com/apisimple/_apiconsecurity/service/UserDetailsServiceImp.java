package com.apisimple._apiconsecurity.service;

import com.apisimple._apiconsecurity.dto.AuthLoginRequestDTO;
import com.apisimple._apiconsecurity.dto.AuthResponseDTO;
import com.apisimple._apiconsecurity.model.UserSecurity;
import com.apisimple._apiconsecurity.repository.IUserRepository;
import com.apisimple._apiconsecurity.utils.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetailsServiceImp implements UserDetailsService {
    // El Imp de la clase referencia a otra nomenclatura para las interfaces

    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Aca tenemos a nuestro Uusario y necestiamos devolverlo en formato UserDetails.
        // Lo que vamos a hacer es traer al usuario de la BBDD
        UserSecurity userSecurity = userRepository.findUserEntityByUsername(username).orElseThrow(() -> new UsernameNotFoundException(
                "El usuario " + username + " no fue encontrado"));

        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();

        // Aca creamos una lista para los roles y pasarlos a SimpleGrantedAuthority
        // Muy importante ponerle el "ROLE_", sino toma que es tdo menos un ROLE.
        userSecurity.getRolesList().forEach(role -> authorityList.add(new SimpleGrantedAuthority("ROLE_".concat(role.getRole()))));

        // Aca creamos una lista para los permisos y pasarlos a SimpleGrantedAuthority
        userSecurity.getRolesList().stream()
                .flatMap(role -> role.getPermissionsList().stream())
                .forEach(permission -> authorityList.add(new SimpleGrantedAuthority(permission.getPermissionName())));

        return new User(
                userSecurity.getUsername(),
                userSecurity.getPassword(),
                userSecurity.isEnabled(),
                userSecurity.isAccountNotExpired(),
                userSecurity.isCredentialNotExpired(),
                userSecurity.isAccountNotLocked(),
                authorityList);

    }


    public AuthResponseDTO loginUser(@Valid AuthLoginRequestDTO authLoginRequest) {

        // Recuperamos nombre de usuario y password
        String username = authLoginRequest.username();
        String password = authLoginRequest.password();

        Authentication authentication = this.authenticate(username, password);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accesToken = jwtUtils.createToken(authentication);
        return new AuthResponseDTO(username, "Login Succesfull", accesToken, true);

    }

    public Authentication authenticate(String username, String password) {

        UserDetails userDetails = this.loadUserByUsername(username);
        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username or password");
        }

        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        return new UsernamePasswordAuthenticationToken(username, userDetails.getPassword(), userDetails.getAuthorities());

    }
}
