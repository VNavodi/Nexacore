package com.nexacore.inventory.modules.sales.service;

import com.nexacore.inventory.modules.sales.dto.InvoiceDTO;
import com.nexacore.inventory.modules.sales.model.Invoice;
import com.nexacore.inventory.modules.sales.model.InvoiceItem;
import com.nexacore.inventory.modules.sales.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    @Transactional
    public Invoice createInvoice(InvoiceDTO dto) {
        Invoice invoice = new Invoice();
        invoice.setCustomerName(dto.getCustomerName());
        invoice.setInvoiceNumber(dto.getInvoiceNumber());
        invoice.setInvoiceDate(dto.getInvoiceDate());
        invoice.setSubtotal(dto.getSubtotal());
        invoice.setGrandTotal(dto.getGrandTotal());

        if (dto.getItems() != null) {
            dto.getItems().forEach(itemDto -> {
                InvoiceItem item = new InvoiceItem();
                item.setItemName(itemDto.getItemName());
                item.setQty(itemDto.getQty());
                item.setUnitPrice(itemDto.getUnitPrice());
                item.setDiscount(itemDto.getDiscount());
                item.setLineTotal(itemDto.getLineTotal());
                invoice.addItem(item);
            });
        }

        return invoiceRepository.save(invoice);
    }
}
