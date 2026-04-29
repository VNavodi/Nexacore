package com.nexacore.inventory.modules.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public record ProductRequest(
        @NotBlank
        String sku,

        @NotBlank
        String name,

        String description,

        String category,

        @NotNull
        @Positive
        Double costPrice,

        @NotNull
        @Positive
        Double sellingPrice,

        Double taxRate,

        String taxType, // inclusive, exclusive, exempt

        @NotNull
        @Positive
        Integer openingStock,

        Integer reorderLevel,

        String warehouse,

        String unitOfMeasure,

        @JsonProperty("customAttributes")
        Map<String, String> customAttributes
) {
}
