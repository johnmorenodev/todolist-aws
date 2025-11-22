package com.todo.app.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.Map;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {
    @JsonProperty("success")
    private final boolean success = false;
    
    @JsonProperty("message")
    private final String message;
    
    @JsonProperty("errors")
    private final Map<String, String> errors;

    public ApiErrorResponse(String message) {
        this.message = message;
        this.errors = null;
    }

    public ApiErrorResponse(String message, Map<String, String> errors) {
        this.message = message;
        this.errors = errors;
    }

    public static ApiErrorResponse error(String message) {
        return new ApiErrorResponse(message);
    }

    public static ApiErrorResponse error(String message, Map<String, String> errors) {
        return new ApiErrorResponse(message, errors);
    }
}

