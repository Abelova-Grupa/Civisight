package com.abeliangroup.civisight.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Issue extends Problem {

    @Enumerated(EnumType.STRING)
    private Urgency urgency;

    private String issueType;
}
