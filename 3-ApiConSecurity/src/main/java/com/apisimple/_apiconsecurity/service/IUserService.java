package com.apisimple._apiconsecurity.service;


import com.apisimple._apiconsecurity.model.UserSecurity;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    public List findAll();
    public Optional findById(Long id);
    public UserSecurity save(UserSecurity userSec);
    public void deleteById(Long id);
    public void update(UserSecurity userSec);
    public String encriptPassword(String password);
}

