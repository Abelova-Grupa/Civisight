package com.abeliangroup.civisight.dto;

import com.abeliangroup.civisight.model.Rank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserStatsDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;

    private Rank rank;

    private int totalPoints;
    private int currentPoints;

    private long reportsSubmitted;     // number of reports user made
    private long issuesCreated;        // number of Issue problems created
    private long suggestionsCreated;   // number of Suggestion problems created

    private long upvotesGiven;
    private long downvotesGiven;

    private long upvotesReceived;       // on user's problems
    private long downvotesReceived;     // on user's problems

}

