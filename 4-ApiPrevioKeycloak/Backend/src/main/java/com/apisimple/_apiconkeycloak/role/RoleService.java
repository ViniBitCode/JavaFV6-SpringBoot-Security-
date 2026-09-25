package com.apisimple._apiconkeycloak.role;

import java.util.List;

public interface RoleService {

    public List<RoleEntity> getRolesList();

    public RoleEntity getRole(String roleName);

}
