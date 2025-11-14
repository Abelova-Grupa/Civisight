package com.abeliangroup.civisight.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Suggestion extends Problem {
    // Additional fields can be added later
}
