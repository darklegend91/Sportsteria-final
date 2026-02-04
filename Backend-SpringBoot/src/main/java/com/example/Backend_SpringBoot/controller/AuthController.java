package com.example.Backend_SpringBoot.controller;

import com.example.Backend_SpringBoot.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private AuthService authService;

    // MODIFIED: 'role' is removed from the signup request.
    public static record SignupRequest(String username, String password, String fullName, String email) {}
    public static record LoginRequest(String username, String password) {}

    @PostMapping("/signup")
    public void signup(@Valid @RequestBody SignupRequest req) {
        // MODIFIED: The role is no longer passed to the service.
        // It will be hardcoded to STUDENT in the AuthService.
        authService.signup(req.username(), req.password(), req.fullName(), req.email());
    }

    @PostMapping("/login")
    public Map<String,Object> login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req.username(), req.password());
    }
}