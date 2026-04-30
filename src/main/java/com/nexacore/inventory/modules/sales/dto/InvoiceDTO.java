package com.nexacore.inventory.modules.sales.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class InvoiceDTO {
    private String customerName;
    private String invoiceNumber;
    private LocalDate invoiceDate;
    private BigDecimal subtotal;
    private BigDecimal grandTotal;
    private List<InvoiceItemDTO> items;
}
