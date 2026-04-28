package com.nexacore.inventory.modules.integrations.application;

import com.nexacore.inventory.modules.integrations.domain.StockReservation;
import com.nexacore.inventory.modules.integrations.infrastructure.StockReservationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class StockReservationService {

    private static final int RESERVATION_TTL_HOURS = 24;

    private final StockReservationRepository stockReservationRepository;

    public StockReservationService(StockReservationRepository stockReservationRepository) {
        this.stockReservationRepository = stockReservationRepository;
    }

    @Transactional
    public StockReservation reserveStock(Long externalOrderId, Long productId, String sku, 
                                        Integer quantity, String source, String reason) {
        log.info("Reserving {} units of {} for order {}", quantity, sku, externalOrderId);

        StockReservation reservation = StockReservation.builder()
            .externalOrderId(externalOrderId)
            .productId(productId)
            .sku(sku)
            .reservedQuantity(quantity)
            .status("RESERVED")
            .reason(reason)
            .source(source)
            .reservedAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusHours(RESERVATION_TTL_HOURS))
            .build();

        reservation = stockReservationRepository.save(reservation);
        log.info("Stock reservation {} created for {} units of {}", reservation.getId(), quantity, sku);
        return reservation;
    }

    @Transactional
    public StockReservation confirmReservation(Long reservationId, Long internalOrderId) {
        StockReservation reservation = stockReservationRepository.findById(reservationId)
            .orElseThrow(() -> new RuntimeException("Reservation not found: " + reservationId));

        log.info("Confirming reservation {} for internal order {}", reservationId, internalOrderId);
        reservation.setStatus("CONFIRMED");
        reservation.setInternalOrderId(internalOrderId);
        reservation.setConfirmedAt(LocalDateTime.now());
        return stockReservationRepository.save(reservation);
    }

    @Transactional
    public void releaseReservation(Long reservationId, String reason) {
        StockReservation reservation = stockReservationRepository.findById(reservationId)
            .orElseThrow(() -> new RuntimeException("Reservation not found: " + reservationId));

        log.info("Releasing reservation {}: {}", reservationId, reason);
        reservation.setStatus("RELEASED");
        reservation.setReleasedAt(LocalDateTime.now());
        stockReservationRepository.save(reservation);
    }

    @Transactional
    public void releaseExpiredReservations() {
        List<StockReservation> expiredReservations = 
            stockReservationRepository.findByStatusAndExpiresAtBefore("RESERVED", LocalDateTime.now());

        log.info("Releasing {} expired reservations", expiredReservations.size());
        for (StockReservation reservation : expiredReservations) {
            reservation.setStatus("EXPIRED");
            reservation.setReleasedAt(LocalDateTime.now());
        }
        stockReservationRepository.saveAll(expiredReservations);
    }

    public Integer getReservedQuantity(Long productId) {
        Integer reserved = stockReservationRepository.sumReservedQuantityByProductIdAndStatus(productId, "RESERVED");
        return reserved != null ? reserved : 0;
    }

    public List<StockReservation> getReservationsForOrder(Long externalOrderId) {
        return stockReservationRepository.findByExternalOrderId(externalOrderId);
    }
}
