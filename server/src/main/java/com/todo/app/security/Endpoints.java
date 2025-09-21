package com.todo.app.security;

public final class Endpoints {
    private Endpoints() {}

    public static final String API_BASE = "/api";
    public static final String AUTH_BASE = API_BASE + "/auth";

    public static final String LOGIN = AUTH_BASE + "/login";
    public static final String REFRESH = AUTH_BASE + "/refresh";
    public static final String LOGOUT = AUTH_BASE + "/logout";
    public static final String SIGNUP = AUTH_BASE + "/signup";
    public static final String CSRF = AUTH_BASE + "/csrf";
    public static final String ME = AUTH_BASE + "/me";
}


