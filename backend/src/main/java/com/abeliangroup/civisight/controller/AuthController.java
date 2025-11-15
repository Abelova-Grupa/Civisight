package com.abeliangroup.civisight.controller;

import com.abeliangroup.civisight.dto.AuthResponse;
import com.abeliangroup.civisight.dto.LoginRequest;
import com.abeliangroup.civisight.dto.RegistrationRequest;
import com.abeliangroup.civisight.model.Citizen;
import com.abeliangroup.civisight.repo.AdminRepository;
import com.abeliangroup.civisight.repo.CitizenRepository;
import com.abeliangroup.civisight.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final CitizenRepository citizenRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @GetMapping("/debug-jwt")
    public Map<String, Object> debugJwt(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) return Map.of("error", "No JWT detected");
        return jwt.getClaims();
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegistrationRequest request) {
        if (citizenRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        Citizen citizen = new Citizen();
        citizen.setFirstName(request.getFirstName());
        citizen.setLastName(request.getLastName());
        citizen.setEmail(request.getEmail());
        citizen.setPassword(passwordEncoder.encode(request.getPassword()));
        citizen.setJmbg(request.getJmbg());
        citizen.setRoles(List.of("CITIZEN")); // default role

        citizenRepository.save(citizen);

        String token = jwtService.generateToken(citizen.getEmail(), citizen.getRoles());
        return new AuthResponse(token);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        Citizen citizen = citizenRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), citizen.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(citizen.getEmail(), citizen.getRoles());
        return new AuthResponse(token);
    }
}

