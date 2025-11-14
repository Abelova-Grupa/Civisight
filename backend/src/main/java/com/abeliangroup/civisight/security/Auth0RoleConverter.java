package com.abeliangroup.civisight.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.stream.Collectors;

public class Auth0RoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        var permissions = jwt.getClaimAsStringList("permissions");

        if (permissions == null) return java.util.List.of();

        return permissions.stream()
            // permission "read:data" → role "ROLE_READ_DATA"
            .map(p -> "ROLE_" + p.toUpperCase().replace(":", "_"))
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
    }
}
