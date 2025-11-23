package com.todo.app.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.DefaultCsrfToken;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class CsrfCookieFilterTest {

    private final CsrfCookieFilter filter = new CsrfCookieFilter();

    @Test
    void filterHandlesPresentTokensWithoutError() {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/account");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        Cookie cookie = new Cookie("XSRF-TOKEN", "test-token-value");
        request.setCookies(cookie);
        request.addHeader("X-XSRF-TOKEN", "test-token-value");
        CsrfToken csrfToken = new DefaultCsrfToken("X-XSRF-TOKEN", "_csrf", "test-token-value");
        request.setAttribute(CsrfToken.class.getName(), csrfToken);

        assertDoesNotThrow(() -> doFilter(request, response, chain));
    }

    @Test
    void filterHandlesMissingTokensWithoutError() {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/account");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        assertDoesNotThrow(() -> doFilter(request, response, chain));
    }

    private void doFilter(MockHttpServletRequest request,
                          MockHttpServletResponse response,
                          MockFilterChain chain) throws ServletException, IOException {
        filter.doFilter(request, response, chain);
    }
}


