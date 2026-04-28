package com.nexacore.inventory.modules.integrations.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookResponse {
    private Boolean success;
    private String message;
    private String webhookEventId;
    private String status; // PENDING, PROCESSING, SUCCESS, CONFLICT
    private LocalDateTime processedAt;
    private List<String> conflictIds;

}
