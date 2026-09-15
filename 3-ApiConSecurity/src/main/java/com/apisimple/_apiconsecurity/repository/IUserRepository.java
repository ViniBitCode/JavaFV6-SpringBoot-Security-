package com.apisimple._apiconsecurity.repository;


import com.apisimple._apiconsecurity.model.UserSecurity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<UserSecurity, Long> {

    // Crea la sentencia en base al nombre en inglés del método
    // Tmb se puede hacer mediante Query pero en este caso no es necesario
    // JPA tiene la capacidad de que si le ponemos el atributo, la query la hace sola por detras
    Optional<UserSecurity> findUserEntityByUsername(String username);

}

