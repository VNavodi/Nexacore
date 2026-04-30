package com.nexacore.inventory.modules.inventory.dto;

public record StockAdjustmentRequest(String sku, Integer quantity, String operation, String reason, String notes) {
}
