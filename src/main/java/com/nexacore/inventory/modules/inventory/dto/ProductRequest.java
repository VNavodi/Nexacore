package com.nexacore.inventory.modules.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record ProductRequest(
        @NotBlank
        String sku,

        @NotBlank
        String name,

        String category,

        @NotNull
        @Positive
        Double costPrice,

        @NotNull
        @Positive
        Double sellingPrice,

        @NotNull
        @PositiveOrZero
        Integer openingStock,

        @PositiveOrZero
        Integer reorderLevel
) {
}
