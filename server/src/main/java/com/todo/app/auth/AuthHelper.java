package com.todo.app.auth;

import com.todo.app.user.User;
import com.todo.app.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthHelper {
    private final UserRepository userRepository;

    public AuthHelper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Gets the current authenticated user from SecurityContext.
     * Returns Optional.empty() if no user is authenticated.
     * 
     * @return Optional containing the User entity if authenticated, empty otherwise
     */
    public Optional<User> getCurrentUser() {
        return getCurrentUsername()
                .flatMap(userRepository::findByUsername);
    }

    /**
     * Gets the current authenticated user, throwing an exception if not authenticated.
     * Use this when you're certain the user must be authenticated (e.g., in authenticated endpoints).
     * 
     * @return The User entity
     * @throws IllegalStateException if no user is authenticated
     */
    public User getCurrentUserOrThrow() {
        return getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("No authenticated user found"));
    }

    /**
     * Gets the current authenticated username from SecurityContext.
     * 
     * @return Optional containing the username if authenticated, empty otherwise
     */
    public Optional<String> getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        String username = authentication.getName();
        return username != null && !username.isEmpty() ? Optional.of(username) : Optional.empty();
    }

    /**
     * Checks if a user is currently authenticated.
     * 
     * @return true if a user is authenticated, false otherwise
     */
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null 
                && authentication.isAuthenticated() 
                && authentication.getName() != null 
                && !authentication.getName().isEmpty();
    }
}

