package com.apisimple._2practicaapisecurity.service;

import com.apisimple._2practicaapisecurity.exception.EntidadNoEncontradaException;
import com.apisimple._2practicaapisecurity.exception.NoHayEntidadesException;
import com.apisimple._2practicaapisecurity.exception.ValorYaExisteException;
import com.apisimple._2practicaapisecurity.model.Permission;
import com.apisimple._2practicaapisecurity.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionServiceImp implements PermissionService{

    @Autowired
    private PermissionRepository permissionRepository;

    @Override
    public List<Permission> getPermissions() { return permissionRepository.findAll(); }

    @Override
    public Permission getPermission(Long idPermission) { return permissionRepository.findById(idPermission).orElse(null); }

    @Override
    public Permission createPermission(Permission permission) {
        if (permissionRepository.existsByPermissionName(permission.getPermissionName())) {
            throw new ValorYaExisteException(permission.getPermissionName());
        }
        return permissionRepository.save(permission);
    }

    @Override
    public Permission deletePermission(Long idPermission) {
        if(this.getPermission(idPermission) == null) {
            throw new EntidadNoEncontradaException("Permiso", idPermission.toString());
        }
        Permission p = this.getPermission(idPermission);
        permissionRepository.deleteById(idPermission);
        return p;
    }

    @Override
    public void updatePermission(Long idPermission, String newPermissionName) {
        Permission updatedPermission = this.getPermission(idPermission);
        updatedPermission.setPermissionName(newPermissionName);
        this.createPermission(updatedPermission);
    }

    @Override
    public void deleteAllPermissions() {
        List<Permission> permissionList = this.getPermissions();
        if (permissionList.isEmpty()) {
            throw new NoHayEntidadesException("Permisos");
        }
        permissionRepository.deleteAll();
    }
}