package com.apisimple._2practicaapisecurity.service;

import com.apisimple._2practicaapisecurity.exception.EntidadNoEncontradaException;
import com.apisimple._2practicaapisecurity.exception.NoHayEntidadesException;
import com.apisimple._2practicaapisecurity.exception.RolNoTienePermisosException;
import com.apisimple._2practicaapisecurity.exception.ValorYaExisteException;
import com.apisimple._2practicaapisecurity.model.Permission;
import com.apisimple._2practicaapisecurity.model.Role;
import com.apisimple._2practicaapisecurity.repository.PermissionRepository;
import com.apisimple._2practicaapisecurity.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RoleServiceImp implements RoleService{

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Override
    public List<Role> getRoles() { return roleRepository.findAll(); }

    @Override
    public Role getRole(Long idRole) { return roleRepository.findById(idRole).orElse(null); }

    @Override
    public Role createRole(Role role) {

        if (roleRepository.existsByRoleName(role.getRoleName())) {
            throw new ValorYaExisteException(role.getRoleName());
        }


        if (role.getPermissionList().isEmpty()) {
            throw new RolNoTienePermisosException();
        }

        Set<Permission> permisosReales = new HashSet<>();
        for (Permission p : role.getPermissionList()) {
            Permission pExistente = permissionRepository.findByPermissionName(p.getPermissionName())
                    .orElseThrow(() -> new EntidadNoEncontradaException("Permiso", p.getPermissionName()));
            permisosReales.add(pExistente);

        }
        role.setPermissionList(permisosReales);

        return roleRepository.save(role);
    }

    @Override
    public Role deleteRole(Long idRole) {
        // Busco primero el rol para eliminarlo y en caso no lo encuentre tiro una excepcion
        if(this.getRole(idRole) == null) {
            throw new EntidadNoEncontradaException("Rol", idRole.toString());
        }
        Role r = this.getRole(idRole);
        roleRepository.deleteById(idRole);
        return r;
    }

    @Override
    public void updateRole(Long idRole, String roleNewName, Set<Permission> newPermissionList) {
        Role updatedRole = this.getRole(idRole);
        updatedRole.setPermissionList(newPermissionList);
        updatedRole.setRoleName(roleNewName);
        this.createRole(updatedRole);
    }

    @Override
    public void deleteAllPermissions() {

        List<Role> roleList = this.getRoles();
        if (roleList.isEmpty()) {
            throw new NoHayEntidadesException("Roles");
        }
        roleRepository.deleteAll();

    }
}
