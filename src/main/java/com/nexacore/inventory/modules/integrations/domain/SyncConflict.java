package com.nexacore.inventory.modules.integrations.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sync_conflicts", indexes = {
    @Index(name = "idx_sync_conflicts_webhook_event_id", columnList = "webhook_event_id"),
    @Index(name = "idx_sync_conflicts_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyncConflict {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long webhookEventId;

    @Column(nullable = false)
    private String conflictType; // STOCK_MISMATCH, DUPLICATE_ORDER, PRICING_VARIANCE, etc.

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    private Long productId;

    private String sku;

    @Column(columnDefinition = "TEXT")
    private String expectedData; // JSON

    @Column(columnDefinition = "TEXT")
    private String actualData; // JSON

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, REJECTED, MANUAL_RESOLVED

    private String resolution; // accept_api, accept_local, custom_value, etc.

    private String resolvedBy; // admin username

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime detectedAt = LocalDateTime.now();

    private LocalDateTime resolvedAt;
}
