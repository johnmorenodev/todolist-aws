package com.todo.app.auth;

import com.todo.app.refreshTokenStore.RefreshTokenStoreService;
import com.todo.app.security.CookieService;
import com.todo.app.security.JwtService;
import com.todo.app.user.User;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthSessionService {
    private final JwtService jwtService;
    private final RefreshTokenStoreService refreshTokenStoreService;
    private final CookieService cookieService;

    @Value("${app.cookies.secure:true}")
    private boolean cookieSecure;

    public AuthSessionService(JwtService jwtService, RefreshTokenStoreService refreshTokenStoreService, CookieService cookieService) {
        this.jwtService = jwtService;
        this.refreshTokenStoreService = refreshTokenStoreService;
        this.cookieService = cookieService;
    }

    public void issueSession(User user, HttpServletResponse response) {
        Map<String, Object> claims = new HashMap<>();
        String access = jwtService.generateAccessToken(user.getUsername(), claims);
        String jti = UUID.randomUUID().toString();
        String refresh = jwtService.generateRefreshToken(user.getUsername(), Map.of("jti", jti));
        refreshTokenStoreService.save(user.getUsername(), jti);
        cookieService.set(response, com.todo.app.security.CookieNames.ACCESS_COOKIE, access, (int) jwtService.getAccessTtlSeconds());
        cookieService.set(response, com.todo.app.security.CookieNames.REFRESH_COOKIE, refresh, (int) jwtService.getRefreshTtlSeconds());
    }

    public void rotateRefresh(String subject, HttpServletResponse response) {
        Map<String, Object> claims = new HashMap<>();
        String newAccess = jwtService.generateAccessToken(subject, claims);
        String newJti = UUID.randomUUID().toString();
        String newRefresh = jwtService.generateRefreshToken(subject, Map.of("jti", newJti));
        refreshTokenStoreService.save(subject, newJti);
        cookieService.set(response, com.todo.app.security.CookieNames.ACCESS_COOKIE, newAccess, (int) jwtService.getAccessTtlSeconds());
        cookieService.set(response, com.todo.app.security.CookieNames.REFRESH_COOKIE, newRefresh, (int) jwtService.getRefreshTtlSeconds());
    }

    public void clearSession(HttpServletResponse response) {
        cookieService.clear(response, com.todo.app.security.CookieNames.ACCESS_COOKIE);
        cookieService.clear(response, com.todo.app.security.CookieNames.REFRESH_COOKIE);
    }
}


