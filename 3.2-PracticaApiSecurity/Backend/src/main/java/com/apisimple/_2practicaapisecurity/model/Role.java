package com.apisimple._2practicaapisecurity.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "role")
public class Role {

    private static final String ROLE_SEQ_GEN = "role_seq";
    private static final String ROLE_SEQ = "role_id_seq";

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ROLE_SEQ_GEN)
    @SequenceGenerator(name = ROLE_SEQ_GEN, sequenceName = ROLE_SEQ, allocationSize = 10)
    private Long idRole;

    @Column(unique = true, nullable = false)
    private String roleName;

    @ManyToMany(fetch = FetchType.EAGER)
    /**
     *  El @JoinTable por lo que entiendo me sirve para crear estas tablas intermedias al tener ManyToMany.
     *  Igual siempre depende de mi modelo de BBDD, quizas lo termine usando en otra cosa.
     */
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissionList = new HashSet<>();


}
