package com.nexacore.inventory.modules.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ApplicationSettingsRequest(
    @NotBlank String companyName,
    @NotBlank String defaultCurrency,
    @NotBlank String language,
    @NotBlank String timezone,
    @NotBlank String notificationEmail,
    @NotNull @PositiveOrZero Integer lowStockThreshold,
    @NotNull Boolean lowStockAlertsEnabled,
    @NotNull Boolean backupEnabled,
    @NotNull Boolean syncEnabled
) {
}