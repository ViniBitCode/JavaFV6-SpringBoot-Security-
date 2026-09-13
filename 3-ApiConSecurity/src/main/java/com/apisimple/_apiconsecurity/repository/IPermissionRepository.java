package com.apisimple._apiconsecurity.repository;


import com.apisimple._apiconsecurity.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPermissionRepository extends JpaRepository<Permission, Long> {
}

