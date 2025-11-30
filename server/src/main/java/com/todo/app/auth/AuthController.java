package com.todo.app.auth;

import com.todo.app.auth.model.MeData;
import com.todo.app.auth.model.request.LoginRequest;
import com.todo.app.common.response.ApiResponse;
import com.todo.app.refreshTokenStore.RefreshTokenStoreService;
import com.todo.app.security.CookieReader;
import com.todo.app.security.CookieNames;
import com.todo.app.security.JwtService;
import com.todo.app.user.User;
import com.todo.app.user.UserService;
import com.todo.app.user.model.UserCreateRequest;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final JwtService jwtService; //
    private final RefreshTokenStoreService refreshTokenStoreService;
    private final AuthSessionService authSessionService;
    private final UserService userService;
    private final AuthHelper authHelper;

    public AuthController(JwtService jwtService, RefreshTokenStoreService refreshTokenStoreService,
            UserService userService, AuthSessionService authSessionService, AuthHelper authHelper) {
        this.jwtService = jwtService;
        this.refreshTokenStoreService = refreshTokenStoreService;
        this.userService = userService;
        this.authSessionService = authSessionService;
        this.authHelper = authHelper;
    }

    @Value("${app.cookies.secure:true}")
    private boolean cookieSecure;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@Valid @RequestBody UserCreateRequest req, HttpServletResponse response) {
        if (userService.existsByUsernameOrEmail(req.getUsername(), req.getEmail())) {
            throw new IllegalArgumentException("Username or email already taken");
        }
        User created = userService.createUser(req);
        authSessionService.issueSession(created, response);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Void>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        Optional<User> user = userService.authenticate(request.username(), request.password());
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        authSessionService.issueSession(user.get(), response);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Void>> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = CookieReader.get(request, CookieNames.REFRESH_COOKIE);
        if (refreshToken == null) {
            throw new IllegalArgumentException("No refresh token");
        }
        String subject = jwtService.validateAndGetSubject(refreshToken);
        if (subject == null) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        String jti = jwtService.getJti(refreshToken);
        if (jti == null || !refreshTokenStoreService.isValid(subject, jti)) {
            refreshTokenStoreService.revoke(subject);
            throw new IllegalArgumentException("Refresh token invalid or rotated");
        }
        authSessionService.rotateRefresh(subject, response);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        String subject = null;
        String access = CookieReader.get(request, CookieNames.ACCESS_COOKIE);
        if (access != null)
            subject = jwtService.validateAndGetSubject(access);
        if (subject == null) {
            String refresh = CookieReader.get(request, CookieNames.REFRESH_COOKIE);
            if (refresh != null)
                subject = jwtService.validateAndGetSubject(refresh);
        }
        if (subject != null)
            refreshTokenStoreService.revoke(subject);
        authSessionService.clearSession(response);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MeData>> me() {
        return authHelper.getCurrentUser()
                .map(user -> ResponseEntity.ok(ApiResponse.ok(new MeData(true, user.getUsername()))))
                .orElse(ResponseEntity.ok(ApiResponse.ok(new MeData(false, null))));
    }

}
