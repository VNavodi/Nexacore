package com.nexacore.inventory.modules.inventory.dto;

import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String sku,
        String name,
        String category,
        Double costPrice,
        Double sellingPrice,
        Integer reorderLevel,
        Integer stockOnHand,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
