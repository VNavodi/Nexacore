package com.nexacore.inventory.modules.auth.service;

import com.nexacore.inventory.modules.auth.dto.LoginRequest;
import com.nexacore.inventory.modules.auth.dto.LoginResponse;
import com.nexacore.inventory.modules.auth.dto.RegisterRequest;
import com.nexacore.inventory.modules.auth.dto.UserResponse;
import com.nexacore.inventory.modules.auth.model.AppUser;
import com.nexacore.inventory.modules.auth.repository.AppUserRepository;
import com.nexacore.inventory.modules.auth.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AppUserRepository appUserRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        String email = request.email().trim();
        String username = (request.username() == null || request.username().isBlank()) 
            ? email 
            : request.username().trim();
        
        String fullName = request.fullName().trim();
        String companyName = request.companyName().trim();
        String password = request.password();

        if (appUserRepository.existsByUsernameIgnoreCase(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (appUserRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        AppUser user = AppUser.builder()
            .username(username)
            .fullName(fullName)
            .companyName(companyName)
            .email(email)
            .passwordHash(passwordEncoder.encode(password))
            .build();

        user = appUserRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(token, mapToUserResponse(user));
    }

    public LoginResponse login(LoginRequest request) {
        String identifier = request.username() == null ? "" : request.username().trim();
        String password = request.password() == null ? "" : request.password().trim();

        AppUser user = appUserRepository.findByUsernameIgnoreCase(identifier)
            .or(() -> appUserRepository.findByEmailIgnoreCase(identifier))
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(token, mapToUserResponse(user));
    }

    private UserResponse mapToUserResponse(AppUser user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getCompanyName(),
            user.getCreatedAt()
        );
    }
}

