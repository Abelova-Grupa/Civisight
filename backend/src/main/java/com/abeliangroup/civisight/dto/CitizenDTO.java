package com.abeliangroup.civisight.dto;

import com.abeliangroup.civisight.model.Citizen;
import com.abeliangroup.civisight.model.Problem;
import com.abeliangroup.civisight.model.Rank;
import com.abeliangroup.civisight.model.Vote;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class CitizenDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String jmbg;
    private String email;
    private String password;

    private Rank rank;
    private Integer totalPoints;
    private Integer currentPoints;

    private Set<Problem> reportedProblems;
    private List<Vote> votes;
    private List<String> roles;

    // ENTITY → DTO
    public static CitizenDTO toDTO(Citizen citizen) {
        CitizenDTO dto = new CitizenDTO();
        dto.setId(citizen.getId());
        dto.setFirstName(citizen.getFirstName());
        dto.setLastName(citizen.getLastName());
        dto.setJmbg(citizen.getJmbg());
        dto.setEmail(citizen.getEmail());
        dto.setPassword(citizen.getPassword());

        if(citizen.getTotalPoints()<500) {
            citizen.setRank(Rank.BEGINNER);
        } else if (citizen.getTotalPoints()<1000) {
            citizen.setRank(Rank.OBSERVER);
        } else if (citizen.getTotalPoints()<3000) {
            citizen.setRank(Rank.SPOTTER);
        } else if (citizen.getTotalPoints()<8000) {
            citizen.setRank(Rank.SURVEYOR);
        } else citizen.setRank(Rank.CIVIC_CHAMPION);
        dto.setRank(citizen.getRank());
        dto.setTotalPoints((int) Math.floor(citizen.getTotalPoints()));
        dto.setCurrentPoints((int)Math.floor(citizen.getCurrentPoints()));

        dto.setVotes(citizen.getVotes());
        dto.setRoles(citizen.getRoles());

        return dto;
    }

    // DTO → ENTITY
    public static Citizen toEntity(CitizenDTO dto) {
        Citizen citizen = new Citizen();
        citizen.setId(dto.getId());
        citizen.setFirstName(dto.getFirstName());
        citizen.setLastName(dto.getLastName());
        citizen.setJmbg(dto.getJmbg());
        citizen.setEmail(dto.getEmail());
        citizen.setPassword(dto.getPassword());

        citizen.setRank(dto.getRank());
        citizen.setTotalPoints(Double.valueOf(dto.getTotalPoints()));
        citizen.setCurrentPoints(Double.valueOf(dto.getCurrentPoints()));

        citizen.setRoles(dto.getRoles());

        citizen.setVotes(dto.getVotes());
        citizen.setRoles(dto.getRoles());

        return citizen;
    }
}
