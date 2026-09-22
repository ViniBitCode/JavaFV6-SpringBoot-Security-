package com.apisimple._apiconkeycloak.permission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface PermissionRepository extends JpaRepository<PermissionEntity, Long> {
}
