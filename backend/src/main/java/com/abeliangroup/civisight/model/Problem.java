package com.abeliangroup.civisight.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Integer upvotes = 0;
    private Integer downvotes = 0;
    private Integer reports = 0;

    @ManyToOne
    @JoinColumn(name = "citizen_id")
    private Citizen author;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToMany(mappedBy = "reportedProblems")
    private Set<Citizen> reporters = new HashSet<>();
}
