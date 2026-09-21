package com.apisimple._2practicaapisecurity.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "permissions")
public class Permission {

    private static final String PERMISSION_SEQ_GEN = "permission_seq";
    private static final String PERMISSION_SEQ = "permission_id_seq";

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = PERMISSION_SEQ_GEN)
    @SequenceGenerator(name = PERMISSION_SEQ_GEN, sequenceName = PERMISSION_SEQ, allocationSize = 10)
    private Long idPermission;

    @Column(unique = true, nullable = false)
    private String permissionName;

}
