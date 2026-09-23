package com.apisimple._apiconsecurity.security.config.filter;


import com.apisimple._apiconsecurity.utils.JwtUtils;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;


public class JwtTokenValidator extends OncePerRequestFilter {

    private JwtUtils jwtUtils;

    public JwtTokenValidator(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        String jwtToken = request.getHeader(HttpHeaders.AUTHORIZATION); // Cuando llegue la requetes, rescato el Token desde el header de la request

        if(jwtToken != null) {
            // Esto lo que hace es eliminar los primeros 7 caracteres. Ya que la cabecera que trae se ve: "bearer {textoToken}"
            jwtToken = jwtToken.substring(7);

            // Validamos el token
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);

            // Si está bien, me traigo el username y las autorizaciones del mismo
            String username = jwtUtils.extractUsername(decodedJWT);
            String authorities = jwtUtils.getSpecificClaim(decodedJWT, "authorities").asString();

            // Comenzamos el proceso del Context Security Holder para reiniciarlo
            Collection<? extends GrantedAuthority> authoritiesList = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
            SecurityContext context = SecurityContextHolder.getContext(); // Guardo mi contexto actual
            Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authoritiesList); //
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

        }

        filterChain.doFilter(request, response);

    }
}


