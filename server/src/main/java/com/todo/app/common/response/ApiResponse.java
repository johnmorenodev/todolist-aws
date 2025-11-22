package com.todo.app.common.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class ApiResponse<T> {
    @JsonProperty("success")
    private final boolean success = true;
    
    @JsonProperty("message")
    private final String message = "OK";
    
    @JsonProperty("data")
    private final T data;

    public ApiResponse(T data) {
        this.data = data;
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(data);
    }

    public static ApiResponse<Void> ok() {
        return new ApiResponse<>(null);
    }
}

