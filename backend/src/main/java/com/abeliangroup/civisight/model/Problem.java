package com.abeliangroup.civisight.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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
    @EqualsAndHashCode.Exclude
    private Citizen author;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToMany(mappedBy = "reportedProblems")
    @JsonBackReference
    @EqualsAndHashCode.Exclude
    private Set<Citizen> reporters = new HashSet<>();
}
