package com.apisimple._apiconsecurity.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users") // Nombre de la tabla en la bbdd
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSecurity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username; // El nombre del usuario es unico debido a la annotation de arriba
    private String password;
    private boolean enabled;
    private boolean accountNotExpired;
    private boolean accountNotLocked;
    private boolean credentialNotExpired;

    // Hacemos uso del Set, ya que no permite repetidos
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL) // Fetch son las estrategias para cargar los datos. Estos atributos garpa investigarlos uno
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "used_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> rolesList = new HashSet<>();



}
