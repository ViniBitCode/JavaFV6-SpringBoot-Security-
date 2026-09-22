package com.apisimple._apiconkeycloak.role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImp implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<RoleEntity> getRolesList() {
        return roleRepository.findAll();
    }

    @Override
    public RoleEntity getRole(String roleName) {
        // Manejar el caso sea Null con las expeciones
        return roleRepository.findByRoleName(roleName);
    }
}
