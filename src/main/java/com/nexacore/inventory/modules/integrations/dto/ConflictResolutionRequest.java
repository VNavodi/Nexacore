package com.nexacore.inventory.modules.integrations.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConflictResolutionRequest {
    private String action; // accept_api, accept_local, custom_value
    private String customValue;
    private String notes;
}
