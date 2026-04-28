package com.nexacore.inventory.modules.integrations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StockReconciliationRequest(
    @NotBlank String sku,
    @NotNull Integer expectedQuantity,
    @NotBlank String sourceSystem
) {
}