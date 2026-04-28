package com.nexacore.inventory.modules.auth.service;

import com.nexacore.inventory.modules.auth.dto.LoginRequest;
import com.nexacore.inventory.modules.auth.dto.LoginResponse;
import com.nexacore.inventory.modules.auth.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    private final JwtUtil jwtUtil;

    public AuthService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        String username = request.username() == null ? "" : request.username().trim();
        String password = request.password() == null ? "" : request.password().trim();

        if (ADMIN_USERNAME.equalsIgnoreCase(username) && ADMIN_PASSWORD.equals(password)) {
            return new LoginResponse(jwtUtil.generateToken(ADMIN_USERNAME));
        }

        throw new IllegalArgumentException("Invalid credentials");
    }
}
