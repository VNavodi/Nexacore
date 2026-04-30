package com.nexacore.inventory.modules.sales.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class InvoiceItemDTO {
    private String itemName;
    private Integer qty;
    private BigDecimal unitPrice;
    private BigDecimal discount;
    private BigDecimal lineTotal;
}
