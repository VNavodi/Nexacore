package com.nexacore.inventory.modules.integrations.infrastructure;

import com.nexacore.inventory.modules.integrations.domain.StockReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockReservationRepository extends JpaRepository<StockReservation, Long> {
    List<StockReservation> findByExternalOrderId(Long externalOrderId);
    List<StockReservation> findByStatusAndExpiresAtBefore(String status, LocalDateTime before);
    
    @Query("SELECT COALESCE(SUM(s.reservedQuantity), 0) FROM StockReservation s WHERE s.productId = ?1 AND s.status = ?2")
    Integer sumReservedQuantityByProductIdAndStatus(Long productId, String status);
}

