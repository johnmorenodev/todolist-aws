package com.todo.app.users.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserCreateRequest {
    @NotBlank
    @Email(message = "Invalid email address")
    private String email;
    @NotBlank
    private String username;
    @NotBlank
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
        message = "Password must be at least 8 characters and include upper, lower, and number"
    )
    private String password;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
}
