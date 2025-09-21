package com.todo.app.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RefreshTokenStore {
    // Fallback in-memory map username -> current refresh token id (jti)
    private final ConcurrentHashMap<String, String> fallbackUsernameToJti = new ConcurrentHashMap<>();

    private final RefreshTokenStoreRepository repository;

    @Value("${app.refresh.fallback-enabled:false}")
    private boolean fallbackEnabled;

    public RefreshTokenStore(RefreshTokenStoreRepository repository) {
        this.repository = repository;
    }

    public void save(String username, String jti) {
        // Try DB first; if unavailable (e.g., migrations not applied), fallback to memory
        try {
            RefreshTokenStoreRow row = repository.findByUsername(username).orElseGet(() -> {
                RefreshTokenStoreRow r = new RefreshTokenStoreRow();
                r.setUsername(username);
                return r;
            });
            row.setJti(jti);
            row.setUpdatedAt(LocalDateTime.now());
            repository.save(row);
            return;
        } catch (RuntimeException ex) {
            if (!fallbackEnabled) throw ex;
        }
        fallbackUsernameToJti.put(username, jti);
    }

    public boolean isValid(String username, String jti) {
        try {
            return repository.findByUsername(username)
                .map(r -> jti != null && jti.equals(r.getJti()))
                .orElse(false);
        } catch (RuntimeException ex) {
            if (!fallbackEnabled) throw ex;
        }
        String current = fallbackUsernameToJti.get(username);
        return current != null && current.equals(jti);
    }

    public void revoke(String username) {
        try {
            repository.deleteByUsername(username);
            return;
        } catch (RuntimeException ex) {
            if (!fallbackEnabled) throw ex;
        }
        fallbackUsernameToJti.remove(username);
    }
}


