package com.abeliangroup.civisight.dto;

import com.abeliangroup.civisight.model.Suggestion;
import lombok.Data;

@Data
public class SuggestionDTO extends ProblemDTO{
    // ENTITY → DTO
    public static SuggestionDTO toDTO(Suggestion suggestion) {
        SuggestionDTO dto = new SuggestionDTO();

        dto.setId(suggestion.getId());
        dto.setDescription(suggestion.getDescription());
        dto.setImageUrl(suggestion.getImageUrl());
        dto.setLatitude(suggestion.getLatitude());
        dto.setLongitude(suggestion.getLongitude());
        dto.setUpvotes(suggestion.getUpvotes());
        dto.setDownvotes(suggestion.getDownvotes());
        dto.setReports(suggestion.getReports());
        dto.setStatus(suggestion.getStatus());

        return dto;
    }

    // DTO → ENTITY
    public static Suggestion toEntity(SuggestionDTO dto) {
        Suggestion suggestion = new Suggestion();

        suggestion.setId(dto.getId());
        suggestion.setDescription(dto.getDescription());
        suggestion.setImageUrl(dto.getImageUrl());
        suggestion.setLatitude(dto.getLatitude());
        suggestion.setLongitude(dto.getLongitude());
        suggestion.setUpvotes(dto.getUpvotes());
        suggestion.setDownvotes(dto.getDownvotes());
        suggestion.setReports(dto.getReports());
        suggestion.setStatus(dto.getStatus());

        return suggestion;
    }
}
