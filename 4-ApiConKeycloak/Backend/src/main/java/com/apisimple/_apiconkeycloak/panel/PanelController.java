package com.apisimple._apiconkeycloak.panel;

import com.apisimple._apiconkeycloak.user.UserEntity;
import com.apisimple._apiconkeycloak.user.UserService;
import com.apisimple._apiconkeycloak.user.dto.UserInfoDTO;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/panel")
public class PanelController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserInfoDTO>> listaDeUsuarios(){
        return ResponseEntity.ok(userService.getUsersInfo());
    }

}
