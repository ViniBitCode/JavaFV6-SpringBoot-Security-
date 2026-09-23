package com.apisimple._apiconkeycloak.user;

import com.apisimple._apiconkeycloak.shared.exception.ValorNotFoundException;
import com.apisimple._apiconkeycloak.shared.exception.ValorYaExisteException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImp implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void crearUsuario(UserEntity userEntity) {

        String userEmail = userEntity.getEmail();
        String userUsername = userEntity.getUsername();

        if(userRepository.existsByEmail(userEmail)) {
            throw new ValorYaExisteException("Email", userEmail);
        }

        if(userRepository.existsByUsername(userUsername)) {
            throw new ValorYaExisteException("Nombre de usuario", userUsername);
        }

        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        userRepository.save(userEntity);
    }

    @Override
    public UserEntity getUser(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new ValorNotFoundException(username));
    }

    @Override
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }
}
