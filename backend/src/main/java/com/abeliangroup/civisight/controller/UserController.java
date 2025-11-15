package com.abeliangroup.civisight.controller;

import com.abeliangroup.civisight.dto.UserStatsDTO;
import com.abeliangroup.civisight.model.Citizen;
import com.abeliangroup.civisight.repo.CitizenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {

    CitizenRepository citizenRepository;

    private Citizen getCurrentCitizen() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        String email = authentication.getName(); // email is stored as JWT subject
        return citizenRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Citizen not found"));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('CITIZEN')")
    public UserStatsDTO getStats(){
        Citizen citizen = getCurrentCitizen();
        UserStatsDTO dto = new UserStatsDTO();
        dto.setCurrentPoints(citizen.getCurrentPoints());
        dto.setTotalPoints(citizen.getTotalPoints());
    }
}
