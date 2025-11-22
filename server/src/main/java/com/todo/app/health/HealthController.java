package com.todo.app.health;

import com.todo.app.common.response.ApiResponse;
import com.todo.app.health.model.HealthData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<HealthData>> checkHealth() {
        HealthData health = new HealthData("running");
        return ResponseEntity.ok(ApiResponse.ok(health));
    }
}
