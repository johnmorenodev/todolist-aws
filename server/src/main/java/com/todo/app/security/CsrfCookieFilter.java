package com.todo.app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class CsrfCookieFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(CsrfCookieFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        CsrfToken token = (CsrfToken) request.getAttribute(CsrfToken.class.getName());

        String headerToken = request.getHeader("X-XSRF-TOKEN");
        String cookieToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("XSRF-TOKEN".equals(cookie.getName())) {
                    cookieToken = cookie.getValue();
                    break;
                }
            }
        }

        if (log.isInfoEnabled()) {
            log.info("CSRF debug - method={} uri={} cookieToken={} headerToken={} attrToken={}",
                    request.getMethod(),
                    request.getRequestURI(),
                    shorten(cookieToken),
                    shorten(headerToken),
                    token != null ? shorten(token.getToken()) : null);
        }

        // Accessing the token ensures it's generated and attached to the request for the repository to set cookie
        request.getAttribute(CsrfToken.class.getName());
        filterChain.doFilter(request, response);
    }

    private String shorten(String value) {
        if (value == null) {
            return null;
        }
        if (value.length() <= 10) {
            return value;
        }
        return value.substring(0, 10) + "...";
    }
}

