package com.apisimple._apiconkeycloak.user;

import com.apisimple._apiconkeycloak.user.dto.UserInfoDTO;

import java.util.List;

public interface UserService {

    public void crearUsuario(UserEntity userEntity);

    public UserEntity getUser(String username);

    public List<UserEntity> getAllUsers();

    public List<UserInfoDTO> getUsersInfo();

}
