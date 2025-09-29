package com.example.Backend_SpringBoot.model;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    STUDENT, ADMIN;

    @Override
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
