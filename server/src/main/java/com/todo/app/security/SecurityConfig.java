package com.todo.app.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        CsrfTokenRepository csrfRepo = CookieCsrfTokenRepository.withHttpOnlyFalse();
        RequestMatcher logoutMatcher = request -> HttpMethod.POST.matches(request.getMethod()) && request.getRequestURI().equals(Endpoints.LOGOUT);
        RequestMatcher loginMatcher = request -> HttpMethod.POST.matches(request.getMethod()) && request.getRequestURI().equals(Endpoints.LOGIN);
        RequestMatcher refreshMatcher = request -> HttpMethod.POST.matches(request.getMethod()) && request.getRequestURI().equals(Endpoints.REFRESH);

        http
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfRepo)
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                        .ignoringRequestMatchers(logoutMatcher, loginMatcher, refreshMatcher)
                )
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, Endpoints.LOGIN, Endpoints.REFRESH, Endpoints.LOGOUT, Endpoints.SIGNUP).permitAll()
                        .requestMatchers(HttpMethod.GET, Endpoints.CSRF, Endpoints.ME).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtCookieAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(csrfCookieFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigin));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Content-Type", "Authorization", "X-XSRF-TOKEN", "Accept", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private final JwtCookieAuthFilter jwtCookieAuthFilter;
    private final CsrfCookieFilter csrfCookieFilter;

    public SecurityConfig(JwtCookieAuthFilter jwtCookieAuthFilter, CsrfCookieFilter csrfCookieFilter) {
        this.jwtCookieAuthFilter = jwtCookieAuthFilter;
        this.csrfCookieFilter = csrfCookieFilter;
    }

    // Extracted filters are defined as standalone @Component beans
}


