package com.todo.app.health;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/health")
public class HealthController {

    @GetMapping
    public Object checkHealth() {
        Map<String, String> health = Map.of("status", "running");
        return health;
    }
}
