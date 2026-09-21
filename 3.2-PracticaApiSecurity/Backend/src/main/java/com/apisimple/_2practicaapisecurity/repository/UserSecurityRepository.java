package com.apisimple._2practicaapisecurity.repository;

import com.apisimple._2practicaapisecurity.model.UserSecurity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSecurityRepository extends JpaRepository<UserSecurity, Long> {

    Optional<UserSecurity> findByUsername(String username);

    Optional<UserSecurity> deleteByUsername(String username);

}
