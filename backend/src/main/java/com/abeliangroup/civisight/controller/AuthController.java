package com.abeliangroup.civisight.controller;

import com.abeliangroup.civisight.dto.LoginRequest;
import com.abeliangroup.civisight.dto.RegistrationRequest;
import com.abeliangroup.civisight.model.Citizen;
import com.abeliangroup.civisight.repo.UserRepository;
import com.abeliangroup.civisight.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(@RequestBody RegistrationRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered!";
        }

        Citizen citizen = new Citizen();
        citizen.setFirstName(request.getFirstName());
        citizen.setLastName(request.getLastName());
        citizen.setEmail(request.getEmail());
        citizen.setPassword(passwordEncoder.encode(request.getPassword()));
        citizen.setRoles(Set.of("CITIZEN"));

        userRepository.save(citizen);

        return "Citizen registered successfully!";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        var userOpt = userRepository.findByEmail(request.getEmail());
        if(userOpt.isEmpty()) return "Invalid credentials!";

        var user = userOpt.get();
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return "Invalid credentials!";
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRoles());
    }
}
