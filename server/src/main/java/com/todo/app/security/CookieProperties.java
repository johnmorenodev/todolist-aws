package com.todo.app.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.cookies")
@Getter
@Setter
public class CookieProperties {
    private boolean secure = true;
    private String sameSite = "Lax";
    private String path = "/";
    private String domain; // optional
}


