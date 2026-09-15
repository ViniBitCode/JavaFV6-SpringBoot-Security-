package com.apisimple._apiconsecurity.service;

import com.apisimple._apiconsecurity.model.UserSecurity;
import com.apisimple._apiconsecurity.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetailServiceImp implements UserDetailsService {
    // El Imp de la clase referencia a otra nomenclatura para las interfaces

    @Autowired
    private IUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Aca tenemos a nuestro Uusario y necestiamos devolverlo en formato UserDetails.
        // Lo que vamos a hacer es traer al usuario de la BBDD
        UserSecurity userSecurity = userRepository.findUserEntityByUsername(username).orElseThrow(() -> new UsernameNotFoundException(
                        "El usuario " + username + " no fue encontrado"));

        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();

        // Aca creamos una lista para los roles y pasarlos a SimpleGrantedAuthority
        // Muy importante ponerle el "ROLE_", sino toma que es todo menos un ROLE.
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


}
