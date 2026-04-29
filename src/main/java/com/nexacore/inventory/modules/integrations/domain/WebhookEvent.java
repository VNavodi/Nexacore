package com.nexacore.inventory.modules.integrations.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "webhook_events", indexes = {
    @Index(name = "idx_idempotency_key", columnList = "idempotency_key", unique = true),
    @Index(name = "idx_event_type", columnList = "event_type"),
    @Index(name = "idx_webhook_events_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String idempotencyKey;

    @Column(nullable = false)
    private String eventType; // e.g., "sales.order.created"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Column(nullable = false)
    private String source; // e.g., "POS", "WEBSITE", "API_CLIENT"

    @Column(nullable = false)
    private String status; // PENDING, PROCESSING, SUCCESS, FAILED, CONFLICT

    private String errorMessage;

    private String externalOrderId;

    private Long internalOrderId;

    @Builder.Default
    private Integer retryCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime processedAt;

    private LocalDateTime lastRetryAt;
}
