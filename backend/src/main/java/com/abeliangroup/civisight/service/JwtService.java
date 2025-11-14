package com.abeliangroup.civisight.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    // Fixed secret key (must be at least 256 bits for HS256)
    private final SecretKey key = Keys.hmacShaKeyFor("my-very-secure-32-char-secret-key!".getBytes());

    public String generateToken(String email, List<String> roles) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(3600); // token valid for 1 hour

        return Jwts.builder()
            .setSubject(email)
            .claim("roles", roles)
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(expiry))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    public SecretKey getKey() {
        return key;
    }
}
