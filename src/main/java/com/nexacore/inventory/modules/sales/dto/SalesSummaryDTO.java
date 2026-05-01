package com.nexacore.inventory.modules.sales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesSummaryDTO {
    private LocalDate date;
    private Long invoiceCount;
    private BigDecimal totalAmount;
}
