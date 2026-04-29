package com.nexacore.inventory.modules.integrations.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_reservations", indexes = {
    @Index(name = "idx_stock_reservations_order_id", columnList = "external_order_id"),
    @Index(name = "idx_stock_reservations_status", columnList = "status"),
    @Index(name = "idx_stock_reservations_product_id", columnList = "product_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long externalOrderId;

    private Long internalOrderId;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String sku;

    @Column(nullable = false)
    private Integer reservedQuantity;

    @Column(nullable = false)
    private String status; // RESERVED, CONFIRMED, RELEASED, EXPIRED

    private String reason; // "Order #xyz", "Manual adjustment", etc.

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime reservedAt = LocalDateTime.now();

    private LocalDateTime confirmedAt;

    private LocalDateTime releasedAt;

    private LocalDateTime expiresAt;

    private String source; // POS, WEBSITE, API_CLIENT
}
