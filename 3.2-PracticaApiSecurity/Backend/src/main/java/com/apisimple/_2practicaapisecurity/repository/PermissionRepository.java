package com.apisimple._2practicaapisecurity.repository;

import com.apisimple._2practicaapisecurity.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    boolean existsByPermissionName(String permissionName);

    Optional<Permission> findByPermissionName(String permissionName);

}
