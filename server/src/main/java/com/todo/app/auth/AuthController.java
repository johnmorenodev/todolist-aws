package com.todo.app.auth;

import com.todo.app.security.CookieUtil;
import com.todo.app.security.JwtService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Value("${server.ssl.enabled:false}")
    private boolean sslEnabled;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        // Demo: accept any non-empty username/password. Replace with real user check.
        if (request.username() == null || request.username().isBlank() || request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "USER");
        String access = jwtService.generateAccessToken(request.username(), claims);
        String refresh = jwtService.generateRefreshToken(request.username(), claims);

        CookieUtil.setCookie(response, CookieUtil.ACCESS_COOKIE, access, (int) 900, sslEnabled);
        CookieUtil.setCookie(response, CookieUtil.REFRESH_COOKIE, refresh, (int) 1209600, sslEnabled);

        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = CookieUtil.getCookie(request, CookieUtil.REFRESH_COOKIE);
        if (refreshToken == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No refresh token"));
        }
        String subject = jwtService.validateAndGetSubject(refreshToken);
        if (subject == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token"));
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "USER");
        String newAccess = jwtService.generateAccessToken(subject, claims);
        CookieUtil.setCookie(response, CookieUtil.ACCESS_COOKIE, newAccess, (int) 900, sslEnabled);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        CookieUtil.clearCookie(response, CookieUtil.ACCESS_COOKIE, sslEnabled);
        CookieUtil.clearCookie(response, CookieUtil.REFRESH_COOKIE, sslEnabled);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        String token = CookieUtil.getCookie(request, CookieUtil.ACCESS_COOKIE);
        String subject = token != null ? jwtService.validateAndGetSubject(token) : null;
        if (subject == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        return ResponseEntity.ok(Map.of("authenticated", true, "username", subject));
    }

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}
}


