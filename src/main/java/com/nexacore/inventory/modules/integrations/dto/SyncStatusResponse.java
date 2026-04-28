package com.nexacore.inventory.modules.integrations.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyncStatusResponse {
    private LocalDateTime lastSync;
    private Integer pendingCount;
    private Integer conflictCount;
    private String overallStatus; // HEALTHY, DEGRADED, CRITICAL
    private LocalDateTime nextRetryTime;
    private String lastErrorMessage;
}
