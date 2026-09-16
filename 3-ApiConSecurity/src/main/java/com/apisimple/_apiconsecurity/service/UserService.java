package com.apisimple._apiconsecurity.service;


import com.apisimple._apiconsecurity.model.UserSecurity;
import com.apisimple._apiconsecurity.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    @Autowired
    private IUserRepository userRepository;

    @Override
    public List findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public UserSecurity save(UserSecurity userSec) {
        return userRepository.save(userSec);
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void update(UserSecurity userSec) {
        save(userSec);
    }

    @Override
    public String encriptPassword(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }
}

