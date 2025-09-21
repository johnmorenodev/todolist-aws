package com.todo.app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {
    private static final int WINDOW_SECONDS = 60;
    private static final int MAX_REQUESTS = 30;

    private static class Counter { int count; long windowStartEpochSec; }

    private final Map<String, Counter> counters = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        boolean isAuthSensitive = HttpMethod.POST.matches(method)
                && ("/api/auth/login".equals(path) || "/api/auth/refresh".equals(path));

        if (!isAuthSensitive) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = request.getRemoteAddr() + ":" + path;
        long now = Instant.now().getEpochSecond();
        Counter c = counters.computeIfAbsent(key, k -> {
            Counter nc = new Counter();
            nc.count = 0;
            nc.windowStartEpochSec = now;
            return nc;
        });

        synchronized (c) {
            if (now - c.windowStartEpochSec >= WINDOW_SECONDS) {
                c.windowStartEpochSec = now;
                c.count = 0;
            }
            c.count++;
            if (c.count > MAX_REQUESTS) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many requests\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}


