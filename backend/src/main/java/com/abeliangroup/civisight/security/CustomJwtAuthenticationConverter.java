package com.abeliangroup.civisight.security;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

public class CustomJwtAuthenticationConverter extends JwtAuthenticationConverter {

    public CustomJwtAuthenticationConverter() {
        // Convert "roles" claim from JWT to authorities
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_"); // Spring requires "ROLE_" prefix
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles"); // match your JWT claim

        this.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
    }
}
