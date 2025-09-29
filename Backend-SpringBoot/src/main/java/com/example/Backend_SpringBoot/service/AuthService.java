package com.example.Backend_SpringBoot.service;

import com.example.Backend_SpringBoot.model.Role;
import com.example.Backend_SpringBoot.model.User;
import com.example.Backend_SpringBoot.repository.UserRepository;
import com.example.Backend_SpringBoot.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;

    // Inject hardcoded admin credentials from properties file
    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    /**
     * MODIFIED: Registers a new user. The role is always hardcoded to STUDENT.
     * The Role parameter is removed.
     */
    public void signup(String username, String rawPassword, String fullName, String email) {
        // Prevent anyone from registering with the admin username
        if (adminUsername.equalsIgnoreCase(username) || userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username '" + username + "' is already taken.");
        }
        User u = new User();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setRole(Role.STUDENT); // Role is now hardcoded
        u.setFullName(fullName);
        u.setEmail(email);
        userRepository.save(u);
    }

    /**
     * MODIFIED: Authenticates a user. Checks for the hardcoded admin first,
     * then falls back to the database for students.
     */
    public Map<String, Object> login(String username, String rawPassword) {
        // --- 1. Hardcoded Admin Login Logic ---
        if (adminUsername.equalsIgnoreCase(username)) {
            if (rawPassword.equals(adminPassword)) { // Direct password check for admin
                String token = jwtTokenProvider.generateToken(adminUsername, Role.ADMIN.name());
                Map<String, Object> res = new HashMap<>();

                // Create a temporary User object for the response payload
                User adminUser = new User();
                adminUser.setId(0L); // Use a non-DB ID
                adminUser.setUsername(adminUsername);
                adminUser.setRole(Role.ADMIN);
                adminUser.setFullName("Administrator");
                adminUser.setEmail("admin@system.com"); // Dummy email

                res.put("token", token);
                res.put("user", adminUser);
                return res;
            } else {
                throw new RuntimeException("Invalid credentials");
            }
        }

        // --- 2. Student Login Logic (from database) ---
        User u = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(rawPassword, u.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(u.getUsername(), u.getRole().name());
        Map<String, Object> res = new HashMap<>();

        u.setPassword(null);
        res.put("token", token);
        res.put("user", u);
        return res;
    }
}