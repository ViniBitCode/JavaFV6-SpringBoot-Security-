package com.apisimple._apiconkeycloak.user;

import com.apisimple._apiconkeycloak.shared.exception.ValorNotFound;
import com.apisimple._apiconkeycloak.shared.exception.ValorYaExiste;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImp implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public void crearUsuario(UserEntity userEntity) {

        String userEmail = userEntity.getEmail();
        String userUsername = userEntity.getUsername();

        if(userRepository.existsByEmail(userEmail)) {
            throw new ValorYaExiste("Email", userEmail);
        }

        if(userRepository.existsByUsername(userUsername)) {
            throw new ValorYaExiste("Nombre de usuario", userUsername);
        }

        userRepository.save(userEntity);
    }

    @Override
    public UserEntity getUser(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new ValorNotFound(username));
    }

    @Override
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }
}
