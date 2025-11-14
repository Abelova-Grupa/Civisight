package com.abeliangroup.civisight.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Arrays;
import java.util.Set;

@Data
@Entity(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String jmbg;
    private String email;
    private String password; // added for standard Spring auth

    public Set<String> getRoles() {
        return null;
    }
}
