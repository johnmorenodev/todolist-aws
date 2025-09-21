package com.todo.app.auth;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_token_store", indexes = {
    @Index(name = "ux_refresh_username", columnList = "username", unique = true)
})
@Getter
@Setter
public class RefreshTokenStoreRow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 191)
    private String username;

    @Column(nullable = false, length = 191)
    private String jti;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}


