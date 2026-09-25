package com.apisimple._apiconkeycloak.permission;

import com.apisimple._apiconkeycloak.shared.exception.ValorNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
class PermissionServiceImp implements PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    @Override
    public List<PermissionEntity> getPermissions() {
        return permissionRepository.findAll();
    }

    @Override
    public PermissionEntity getPermission(String permissionName) {
        return permissionRepository.findByPermissionName(permissionName).orElseThrow(() -> new ValorNotFoundException(permissionName));
    }
}
