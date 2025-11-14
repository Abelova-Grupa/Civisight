package com.abeliangroup.civisight.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> roles = Set.of("ADMIN");
}
