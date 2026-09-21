package com.apisimple._2practicaapisecurity.service;

import com.apisimple._2practicaapisecurity.model.Permission;
import com.apisimple._2practicaapisecurity.model.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {

    public List<Role> getRoles();

    public Role getRole(Long idRole);

    public Role createRole(Role role);

    public Role deleteRole(Long idRole);

    public void updateRole(Long idRole, String roleNewName, Set<Permission> newPermissionList);

    public void deleteAllPermissions();
}
