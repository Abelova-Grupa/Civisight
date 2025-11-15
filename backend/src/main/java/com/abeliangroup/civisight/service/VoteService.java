package com.abeliangroup.civisight.service;

import com.abeliangroup.civisight.dto.ProblemDTO;
import com.abeliangroup.civisight.model.Citizen;
import com.abeliangroup.civisight.model.Problem;
import com.abeliangroup.civisight.repo.CitizenRepository;
import com.abeliangroup.civisight.repo.VoteRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final CitizenRepository citizenRepository;

    private Citizen getCurrentCitizen() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        String email = authentication.getName(); // email is stored as JWT subject
        return citizenRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Citizen not found"));
    }

    public void determineCurrentCitizensOpinion(Problem problem, ProblemDTO dto) {
        Citizen citizen = getCurrentCitizen();

        short opinion =  voteRepository
            .findByCitizenAndProblem(citizen, problem)
            .map(vote -> {
                if (Boolean.TRUE.equals(vote.isUp())) return (short) 1;
                if (Boolean.TRUE.equals(vote.isDown())) return (short) -1;
                return (short) 0;
            })
            .orElse((short) 0);

        dto.setUserOpinion(opinion);
    }


}
