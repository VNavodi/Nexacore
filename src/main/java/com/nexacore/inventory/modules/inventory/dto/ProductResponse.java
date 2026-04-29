package com.nexacore.inventory.modules.inventory.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ProductResponse(
        Long id,
        String sku,
        String name,
        String description,
        String category,
        Double costPrice,
        Double sellingPrice,
        Double taxRate,
        String taxType,
        Integer openingStock,
        Integer reorderLevel,
        String warehouse,
        String unitOfMeasure,
        Integer stockQuantity,
        Map<String, String> customAttributes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
