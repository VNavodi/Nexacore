package com.nexacore.inventory.modules.settings.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "application_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(name = "default_currency", length = 10)
    private String defaultCurrency;

    @Column(length = 50)
    private String language;

    @Column(length = 80)
    private String timezone;

    @Column(name = "notification_email", length = 150)
    private String notificationEmail;

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold;

    @Column(name = "low_stock_alerts_enabled")
    private Boolean lowStockAlertsEnabled;

    @Column(name = "backup_enabled")
    private Boolean backupEnabled;

    @Column(name = "sync_enabled")
    private Boolean syncEnabled;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}