package com.abeliangroup.civisight.dto;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String firstName;
    private String lastName;
    private String jmbg;
    private String email;
    private String password;
}

