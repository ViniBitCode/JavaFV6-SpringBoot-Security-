package com.apisimple._apiconkeycloak.user;

import com.apisimple._apiconkeycloak.role.RoleEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter @Getter
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.TIME)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String email;

    private boolean enabled = true;
    private boolean accountNotExpired = true;
    private boolean accountNotLocked = true;
    private boolean credentialNotExpired = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_role", nullable = false)
    private RoleEntity role;

}
