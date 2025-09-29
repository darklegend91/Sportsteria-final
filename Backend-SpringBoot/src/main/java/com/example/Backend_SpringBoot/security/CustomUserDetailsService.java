package com.example.Backend_SpringBoot.security;

import com.example.Backend_SpringBoot.model.User;
import com.example.Backend_SpringBoot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy; // <-- Import @Lazy
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    // --- MODIFIED: Switched to Constructor Injection with @Lazy ---
    // This breaks the circular dependency cycle during startup.
    @Autowired
    public CustomUserDetailsService(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // --- Check for Hardcoded Admin User ---
        if (adminUsername.equalsIgnoreCase(username)) {
            return new org.springframework.security.core.userdetails.User(
                    adminUsername,
                    passwordEncoder.encode(adminPassword), // Password must be encoded
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // --- Load Student User from Database ---
        User u = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        SimpleGrantedAuthority auth = new SimpleGrantedAuthority("ROLE_" + u.getRole().name());

        return new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(),
                List.of(auth)
        );
    }
}