package com.abeliangroup.civisight.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@DiscriminatorValue("CITIZEN")
public class Citizen extends User {

    @Enumerated(EnumType.STRING)
    private Rank rank;

    private Integer totalPoints = 0;
    private Integer currentPoints = 0;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Problem> problems;

    @ManyToMany
    @JoinTable(
        name = "citizen_problem",
        joinColumns = @JoinColumn(name = "citizen_id"),
        inverseJoinColumns = @JoinColumn(name = "problem_id")
    )
    private Set<Problem> reportedProblems = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> roles = Set.of("CITIZEN");
}
