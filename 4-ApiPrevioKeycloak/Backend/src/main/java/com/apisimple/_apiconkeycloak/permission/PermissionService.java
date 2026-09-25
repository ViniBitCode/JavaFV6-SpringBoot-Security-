package com.apisimple._apiconkeycloak.permission;

import java.util.List;

public interface PermissionService {

    public List<PermissionEntity> getPermissions();

    public PermissionEntity getPermission(String permissionName);

}
