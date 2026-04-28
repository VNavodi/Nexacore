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
public class ConflictResolutionResponse {
    private Boolean success;
    private String message;
    private Long conflictId;
    private LocalDateTime resolvedAt;
    private String resolution;
}
