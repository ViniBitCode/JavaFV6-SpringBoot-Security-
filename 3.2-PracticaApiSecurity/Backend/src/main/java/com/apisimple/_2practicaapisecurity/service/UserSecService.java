package com.apisimple._2practicaapisecurity.service;

import com.apisimple._2practicaapisecurity.dto.UserInfoDTO;
import com.apisimple._2practicaapisecurity.model.Role;
import com.apisimple._2practicaapisecurity.model.UserSecurity;

import java.util.List;

public interface UserSecService {

    public List<UserSecurity> getUsers();

    public UserSecurity getUser(String username);

    public UserSecurity createUserSec(UserSecurity userSecurity);

    public void deleteUser(String username);

    public void updateUser(Long idUser, Role newRole);

    public List<UserInfoDTO> getUsersInfo();

}
