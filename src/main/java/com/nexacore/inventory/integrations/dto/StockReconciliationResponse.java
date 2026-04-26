package com.nexacore.inventory.integrations.dto;

public record StockReconciliationResponse(
    String status,
    String sku,
    Integer expectedQuantity,
    Integer actualQuantity,
    Integer difference,
    boolean match,
    String sourceSystem,
    String message
) {
}