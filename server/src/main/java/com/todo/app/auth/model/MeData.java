package com.todo.app.auth.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeData {
    private boolean authenticated;
    private String username;
}

