package com.nexacore.inventory.modules.integrations.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookOrderRequest {
    private String orderId; // External order ID from POS/Website
    private String source; // POS, WEBSITE, MOBILE_APP
    private String customerName;
    private String customerEmail;
    private List<OrderItem> items;
    private TaxBreakdown taxBreakdown;
    private String paymentStatus; // PENDING, COMPLETED, FAILED
    private BigDecimal totalAmount;
    private String currencyCode;
    private Long timestamp;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItem {
        private String sku;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal discount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TaxBreakdown {
        private BigDecimal taxRate;
        private BigDecimal taxAmount;
        private String taxRegion;
    }
}
