package com.abeliangroup.civisight.dto;

import com.abeliangroup.civisight.model.Issue;
import com.abeliangroup.civisight.model.Problem;
import com.abeliangroup.civisight.model.Urgency;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MapDataDTO {

    private Double latitude;
    private Double longitude;
    private Urgency urgency;

    public static MapDataDTO toDTO(Issue problem) {
        MapDataDTO dto = new MapDataDTO();
        dto.setLatitude(problem.getLatitude());
        dto.setLongitude(problem.getLongitude());
        dto.setUrgency(problem.getUrgency());
        return dto;
    }
}
