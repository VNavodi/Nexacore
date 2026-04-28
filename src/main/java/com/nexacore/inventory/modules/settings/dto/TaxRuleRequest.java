package com.nexacore.inventory.modules.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record TaxRuleRequest(
    @NotBlank String name,
    @NotNull @PositiveOrZero Double rate,
    @NotBlank String appliesTo,
    @NotNull Boolean active
) {
}