package com.todo.app.refreshTokenStore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenStoreRepository extends JpaRepository<RefreshTokenStore, Long> {
    Optional<RefreshTokenStore> findByUsername(String username);
    void deleteByUsername(String username);
}


