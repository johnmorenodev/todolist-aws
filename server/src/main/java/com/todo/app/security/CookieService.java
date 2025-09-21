package com.todo.app.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

@Component
public class CookieService {
    private final CookieProperties props;

    public CookieService(CookieProperties props) {
        this.props = props;
    }

    public void set(HttpServletResponse response, String name, String value, int maxAgeSeconds) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(props.isSecure());
        cookie.setPath(props.getPath());
        if (props.getDomain() != null && !props.getDomain().isBlank()) cookie.setDomain(props.getDomain());
        cookie.setMaxAge(maxAgeSeconds);
        cookie.setAttribute("SameSite", props.getSameSite());
        response.addCookie(cookie);
    }

    public void clear(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(props.isSecure());
        cookie.setPath(props.getPath());
        if (props.getDomain() != null && !props.getDomain().isBlank()) cookie.setDomain(props.getDomain());
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", props.getSameSite());
        response.addCookie(cookie);
    }
}


