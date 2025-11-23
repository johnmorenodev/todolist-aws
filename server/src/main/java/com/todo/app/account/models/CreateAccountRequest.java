package com.todo.app.account.models;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateAccountRequest {
    @NotBlank
    private String name;
}
