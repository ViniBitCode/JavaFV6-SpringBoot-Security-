package com.apisimple._2practicaapisecurity.service;

import com.apisimple._2practicaapisecurity.dto.UserInfoDTO;
import com.apisimple._2practicaapisecurity.exception.EntidadNoEncontradaException;
import com.apisimple._2practicaapisecurity.exception.NoHayEntidadesException;
import com.apisimple._2practicaapisecurity.exception.UsuarioSinRolException;
import com.apisimple._2practicaapisecurity.exception.ValorYaExisteException;
import com.apisimple._2practicaapisecurity.model.Role;
import com.apisimple._2practicaapisecurity.model.UserSecurity;
import com.apisimple._2practicaapisecurity.repository.RoleRepository;
import com.apisimple._2practicaapisecurity.repository.UserSecurityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserSecImp implements UserSecService {

    @Autowired
    private UserSecurityRepository userSecurityRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<UserSecurity> getUsers() {
        List<UserSecurity> us = userSecurityRepository.findAll();
        if(us.isEmpty()) {
            throw new NoHayEntidadesException("Usuarios");
        }
        return userSecurityRepository.findAll();
    }

    @Override
    public UserSecurity getUser(String username) {
        // Busco usuario por nombre
        UserSecurity user = userSecurityRepository.findByUsername(username).orElse(null);
        if(user == null) {
            throw new EntidadNoEncontradaException("Usuario", username);
        }
        return user;
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserSecurity createUserSec(UserSecurity userSecurity) {

        // Ver que no exista ya el usuario con el mismo username
        if(userSecurityRepository.findByUsername(userSecurity.getUsername()).isPresent()) {
            throw new ValorYaExisteException(userSecurity.getUsername());
        }

        // Ver que tenga un rol asociado
        if (userSecurity.getRole() == null || userSecurity.getRole().getRoleName() == null) {
            throw new UsuarioSinRolException();
        }

        // Ver que el rol que tiene exista en la BBDD
        Role rolReal = roleRepository.findByRoleName(userSecurity.getRole().getRoleName())
                .orElseThrow(() -> new EntidadNoEncontradaException("Rol", userSecurity.getRole().getRoleName()));

        userSecurity.setRole(rolReal);
        userSecurity.setEnabled(true);
        userSecurity.setAccountNotExpired(true);
        userSecurity.setAccountNotLocked(true);
        userSecurity.setPassword(passwordEncoder.encode(userSecurity.getPassword()));userSecurity.setCredentialNotExpired(true);


        return userSecurityRepository.save(userSecurity);
    }

    @Override
    @Transactional
    public void deleteUser(String username) {
        userSecurityRepository.deleteByUsername(username).orElseThrow(() -> new EntidadNoEncontradaException("Usuario", username));;}

    @Override
    public void updateUser(Long idUser, Role newRole) {
//        UserSecurity updatedUserSec = this.getUser(idUser);
//        updatedUserSec.setRole(newRole);
//        this.createUserSec(updatedUserSec);
    }

    @Override
    public List<UserInfoDTO> getUsersInfo() {
       List<UserSecurity> usuarios = userSecurityRepository.findAll();
       List<UserInfoDTO> usuariosDTO = new ArrayList<>();

       for (UserSecurity u : usuarios) {
           usuariosDTO.add(new UserInfoDTO(u.getUsername(), u.getRole().getRoleName()));
       }

       return usuariosDTO;
    }


}
