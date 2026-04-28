package com.nexacore.inventory.modules.settings.dto;

import java.time.LocalDateTime;

public record ApplicationSettingsResponse(
    Long id,
    String companyName,
    String defaultCurrency,
    String language,
    String timezone,
    String notificationEmail,
    Integer lowStockThreshold,
    Boolean lowStockAlertsEnabled,
    Boolean backupEnabled,
    Boolean syncEnabled,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}