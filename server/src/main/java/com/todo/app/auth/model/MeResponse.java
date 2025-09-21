package com.todo.app.auth.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MeResponse {
    private boolean authenticated;
    private String username; // nullable when not authenticated
}


