package com.todo.app.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenStoreRepository extends JpaRepository<RefreshTokenStoreRow, Long> {
    Optional<RefreshTokenStoreRow> findByUsername(String username);
    void deleteByUsername(String username);
}


