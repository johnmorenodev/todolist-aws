package com.todo.app.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access.ttl-seconds}")
    private long accessTtlSeconds;

    @Value("${jwt.refresh.ttl-seconds}")
    private long refreshTtlSeconds;

    private SecretKey key;

    @PostConstruct
    void init() {
        // Accept raw string secret; if it looks like base64, decode it, else use bytes
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            key = Keys.hmacShaKeyFor(decoded);
        } catch (Exception e) {
            key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
    }

    public String generateAccessToken(String subject, Map<String, Object> claims) {
        return generateToken(subject, claims, accessTtlSeconds);
    }

    public String generateRefreshToken(String subject, Map<String, Object> claims) {
        return generateToken(subject, claims, refreshTtlSeconds);
    }

    private String generateToken(String subject, Map<String, Object> claims, long ttlSeconds) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(subject)
                .claims(claims)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(ttlSeconds)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateAndGetSubject(String token) {
        try {
            return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
        } catch (SignatureException ex) {
            return null;
        } catch (Exception ex) {
            return null;
        }
    }
}


