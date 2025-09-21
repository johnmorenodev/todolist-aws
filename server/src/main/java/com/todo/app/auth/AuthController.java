package com.todo.app.auth;

import com.todo.app.auth.model.AuthOkResponse;
import com.todo.app.auth.model.ErrorResponse;
import com.todo.app.auth.model.MeResponse;
import com.todo.app.security.CookieReader;
import com.todo.app.security.CookieNames;
import com.todo.app.security.JwtService;
import com.todo.app.users.User;
import com.todo.app.users.UserService;
import com.todo.app.users.model.UserCreateRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final JwtService jwtService;
    private final RefreshTokenStore refreshTokenStore;
    private final AuthSessionService authSessionService;
    private final UserService userService;

    public AuthController(JwtService jwtService, RefreshTokenStore refreshTokenStore, UserService userService, AuthSessionService authSessionService) {
        this.jwtService = jwtService;
        this.refreshTokenStore = refreshTokenStore;
        this.userService = userService;
        this.authSessionService = authSessionService;
    }

    @Value("${app.cookies.secure:true}")
    private boolean cookieSecure;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserCreateRequest req, HttpServletResponse response) {
        if (userService.existsByUsernameOrEmail(req.getUsername(), req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username or email already taken"));
        }
        User created = userService.createUser(req);
        authSessionService.issueSession(created, response);
        return ResponseEntity.ok(new AuthOkResponse(true));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {

        User user = userService.authenticate(request.username(), request.password());
        if (user == null) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid credentials"));
        }
        authSessionService.issueSession(user, response);
        return ResponseEntity.ok(new AuthOkResponse(true));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = CookieReader.get(request, CookieNames.REFRESH_COOKIE);
        if (refreshToken == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No refresh token"));
        }
        String subject = jwtService.validateAndGetSubject(refreshToken);
        if (subject == null) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid refresh token"));
        }
        String jti = jwtService.getJti(refreshToken);
        if (jti == null || !refreshTokenStore.isValid(subject, jti)) {
            refreshTokenStore.revoke(subject);
            return ResponseEntity.status(401).body(new ErrorResponse("Refresh token invalid or rotated"));
        }
        authSessionService.rotateRefresh(subject, response);
        return ResponseEntity.ok(new AuthOkResponse(true));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String subject = null;
        String access = CookieReader.get(request, CookieNames.ACCESS_COOKIE);
        if (access != null) subject = jwtService.validateAndGetSubject(access);
        if (subject == null) {
            String refresh = CookieReader.get(request, CookieNames.REFRESH_COOKIE);
            if (refresh != null) subject = jwtService.validateAndGetSubject(refresh);
        }
        if (subject != null) refreshTokenStore.revoke(subject);
        authSessionService.clearSession(response);
        return ResponseEntity.ok(new AuthOkResponse(true));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(new MeResponse(false, null));
        }
        return ResponseEntity.ok(new MeResponse(true, principal.getName()));
    }

    @GetMapping("/csrf")
    public ResponseEntity<?> csrf() {
        return ResponseEntity.noContent().build();
    }

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}
}


