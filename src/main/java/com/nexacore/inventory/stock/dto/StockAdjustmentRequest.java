package com.nexacore.inventory.stock.dto;

public record StockAdjustmentRequest(String sku, Integer quantity, String operation) {
}
