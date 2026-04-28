package com.nexacore.inventory.modules.integrations.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sync_logs", indexes = {
    @Index(name = "idx_source", columnList = "source"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_synced_at", columnList = "syncedAt")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyncLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String source; // POS, WEBSITE, EXTERNAL_API

    @Column(nullable = false)
    private String status; // SUCCESS, FAILED, PARTIAL

    @Builder.Default
    private Integer ordersProcessed = 0;

    @Builder.Default
    private Integer ordersSkipped = 0;

    @Builder.Default
    private Integer conflictsDetected = 0;

    @Column(columnDefinition = "LONGTEXT")
    private String details;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime syncedAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    private Long durationMs;

    private String errorSummary;
}
