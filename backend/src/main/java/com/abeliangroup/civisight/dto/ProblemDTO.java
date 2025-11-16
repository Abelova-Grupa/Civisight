package com.abeliangroup.civisight.dto;

import com.abeliangroup.civisight.model.*;
import com.abeliangroup.civisight.repo.VoteRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

@Data
public class ProblemDTO {

    private Long id;
    private String description;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Integer upvotes;
    private Integer downvotes;
    private Integer reports;
    private Short userOpinion = 0; // -1: downvote; 0: nothing; +1: upvoted
    private Status status;

    private Urgency urgency;
    private String classification;

    // ENTITY → DTO
    public static ProblemDTO toDTO(Problem problem) {
        ProblemDTO dto = new ProblemDTO();
        dto.setId(problem.getId());
        dto.setDescription(problem.getDescription());
        dto.setImageUrl(problem.getImageUrl());
        dto.setLatitude(problem.getLatitude());
        dto.setLongitude(problem.getLongitude());
        dto.setUpvotes(problem.getUpvotes());
        dto.setDownvotes(problem.getDownvotes());
        dto.setReports(problem.getReports());
        dto.setStatus(problem.getStatus());

        if(problem instanceof Issue) {
            Issue issue = (Issue) problem;
            dto.setUrgency(issue.getUrgency());
            dto.setClassification(issue.getIssueType());
        }

        return dto;
    }

    // DTO → ENTITY
    public static Problem toEntity(ProblemDTO dto) {
        Problem problem = new Problem(){};
        problem.setId(dto.getId());
        problem.setDescription(dto.getDescription());
        problem.setImageUrl(dto.getImageUrl());
        problem.setLatitude(dto.getLatitude());
        problem.setLongitude(dto.getLongitude());
        problem.setUpvotes(dto.getUpvotes());
        problem.setDownvotes(dto.getDownvotes());
        problem.setReports(dto.getReports());
        problem.setStatus(dto.getStatus());
        return problem;
    }

}
