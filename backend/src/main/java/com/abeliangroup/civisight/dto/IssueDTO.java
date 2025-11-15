package com.abeliangroup.civisight.dto;

import com.abeliangroup.civisight.model.Issue;
import com.abeliangroup.civisight.model.Problem;
import com.abeliangroup.civisight.model.Status;
import com.abeliangroup.civisight.model.Urgency;
import lombok.Data;

@Data
public class IssueDTO extends ProblemDTO {
    private Urgency urgency;
    private String issueType;

    // ENTITY → DTO
    public static IssueDTO toDTO(Issue issue) {
        IssueDTO dto = new IssueDTO();
        ProblemDTO base = ProblemDTO.toDTO(issue);

        dto.setId(base.getId());
        dto.setDescription(base.getDescription());
        dto.setImageUrl(base.getImageUrl());
        dto.setLatitude(base.getLatitude());
        dto.setLongitude(base.getLongitude());
        dto.setUpvotes(base.getUpvotes());
        dto.setDownvotes(base.getDownvotes());
        dto.setReports(base.getReports());
        dto.setStatus(base.getStatus());

        dto.setUrgency(issue.getUrgency());

        return dto;
    }

    // DTO → ENTITY
    public static Issue toEntity(IssueDTO dto) {
        Issue issue = new Issue();

        issue.setId(dto.getId());
        issue.setDescription(dto.getDescription());
        issue.setImageUrl(dto.getImageUrl());
        issue.setLatitude(dto.getLatitude());
        issue.setLongitude(dto.getLongitude());
        issue.setUpvotes(dto.getUpvotes());
        issue.setDownvotes(dto.getDownvotes());
        issue.setReports(dto.getReports());
        issue.setStatus(dto.getStatus());

        issue.setUrgency(dto.getUrgency());

        return issue;
    }
}
