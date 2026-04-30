package com.nexacore.inventory.modules.sales.repository;

import com.nexacore.inventory.modules.sales.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
