package com.nexacore.inventory.modules.settings.dto;

import java.time.LocalDateTime;

public record TaxRuleResponse(
    Long id,
    String name,
    Double rate,
    String appliesTo,
    Boolean active,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}