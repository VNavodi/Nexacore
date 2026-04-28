package com.nexacore.inventory.modules.integrations.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record StockEventRequest(
    @NotBlank String sourceSystem,
    @NotBlank String eventId,
    @NotNull StockEventType eventType,
    @NotBlank String sku,
    @NotNull Integer quantity,
    @NotNull @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX") OffsetDateTime occurredAt
) {
}