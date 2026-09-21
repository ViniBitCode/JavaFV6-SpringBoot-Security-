package com.apisimple._2practicaapisecurity.service;

import com.apisimple._2practicaapisecurity.model.UserSecurity;
import com.apisimple._2practicaapisecurity.repository.UserSecurityRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetailsServiceImp implements UserDetailsService {

    private final UserSecurityRepository userSecurityRepository;

    public UserDetailsServiceImp(UserSecurityRepository userSecurityRepository) {
        this.userSecurityRepository = userSecurityRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserSecurity usuario = userSecurityRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario " + username + " no existe"));

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getRole().getRoleName()));
        usuario.getRole().getPermissionList()
                .forEach(p -> authorities.add(new SimpleGrantedAuthority(p.getPermissionName())));

        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .authorities(authorities)
                .accountExpired(!usuario.isAccountNotExpired())
                .accountLocked(!usuario.isAccountNotLocked())
                .credentialsExpired(!usuario.isCredentialNotExpired())
                .disabled(!usuario.isEnabled())
                .build();
    }

}
