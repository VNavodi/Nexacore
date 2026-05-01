package com.nexacore.inventory.modules.sales.repository;

import com.nexacore.inventory.modules.sales.model.Invoice;
import com.nexacore.inventory.modules.sales.dto.SalesSummaryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    @Query("SELECT new com.nexacore.inventory.modules.sales.dto.SalesSummaryDTO(i.invoiceDate, COUNT(i), SUM(i.grandTotal)) " +
           "FROM Invoice i GROUP BY i.invoiceDate ORDER BY i.invoiceDate DESC")
    List<SalesSummaryDTO> getSalesSummary();
}
