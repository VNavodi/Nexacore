package com.nexacore.inventory.integrations.dto;

import java.time.OffsetDateTime;

public record StockEventResponse(
    String status,
    boolean duplicate,
    String message,
    String sourceSystem,
    String eventId,
    StockEventType eventType,
    String sku,
    Integer quantity,
    Integer beforeStock,
    Integer afterStock,
    OffsetDateTime occurredAt,
    OffsetDateTime processedAt
) {
}