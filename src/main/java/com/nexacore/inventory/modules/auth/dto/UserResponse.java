package com.nexacore.inventory.modules.auth.dto;

import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String username,
    String email,
    String fullName,
    String companyName,
    LocalDateTime createdAt
) {
}
