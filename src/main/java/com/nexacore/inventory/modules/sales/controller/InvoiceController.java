package com.nexacore.inventory.modules.sales.controller;

import com.nexacore.inventory.modules.sales.dto.InvoiceDTO;
import com.nexacore.inventory.modules.sales.model.Invoice;
import com.nexacore.inventory.modules.sales.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody InvoiceDTO dto) {
        Invoice created = invoiceService.createInvoice(dto);
        return ResponseEntity.ok(created);
    }
}
