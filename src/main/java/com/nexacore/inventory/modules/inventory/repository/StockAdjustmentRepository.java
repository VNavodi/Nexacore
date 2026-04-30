package com.nexacore.inventory.modules.inventory.repository;

import com.nexacore.inventory.modules.inventory.model.StockAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockAdjustmentRepository extends JpaRepository<StockAdjustment, Long> {
}
