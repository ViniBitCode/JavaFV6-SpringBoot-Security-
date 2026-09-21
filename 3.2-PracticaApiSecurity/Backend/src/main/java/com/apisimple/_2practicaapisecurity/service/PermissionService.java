package com.apisimple._2practicaapisecurity.service;

import com.apisimple._2practicaapisecurity.model.Permission;

import java.util.List;

public interface PermissionService {

    public List<Permission> getPermissions();

    public Permission getPermission(Long idPermission);

    public Permission createPermission(Permission permission);

    public Permission deletePermission(Long idPermission);

    public void updatePermission(Long idPermission, String newPermissionName);

    public void deleteAllPermissions();

}
