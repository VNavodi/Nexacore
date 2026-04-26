package com.nexacore.inventory.stock.repository;

import com.nexacore.inventory.stock.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    Optional<StockMovement> findByEventId(String eventId);
    List<StockMovement> findBySkuOrderByOccurredAtDesc(String sku);
}