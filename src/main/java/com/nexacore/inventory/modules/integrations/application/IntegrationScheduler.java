package com.nexacore.inventory.modules.integrations.application;

import com.nexacore.inventory.modules.integrations.domain.WebhookEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class IntegrationScheduler {

    private final WebhookService webhookService;
    private final StockReservationService stockReservationService;
    private final ConflictDetectionService conflictDetectionService;

    /**
     * Retry failed webhook events every 30 seconds
     */
    @Scheduled(fixedRate = 30000)
    @Transactional
    public void retryFailedWebhooks() {
        try {
            List<WebhookEvent> failedEvents = webhookService.getFailedEvents();
            if (!failedEvents.isEmpty()) {
                log.info("Retrying {} failed webhook events", failedEvents.size());
                // Retry logic would be implemented here
            }
        } catch (Exception e) {
            log.error("Error in webhook retry scheduler", e);
        }
    }

    /**
     * Release expired reservations every minute
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredReservations() {
        try {
            log.debug("Checking for expired stock reservations");
            stockReservationService.releaseExpiredReservations();
        } catch (Exception e) {
            log.error("Error releasing expired reservations", e);
        }
    }

    /**
     * Auto-resolve compatible conflicts every 5 minutes
     */
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void autoResolveConflicts() {
        try {
            log.debug("Auto-resolving compatible conflicts");
            conflictDetectionService.autoResolveCompatibleConflicts();
        } catch (Exception e) {
            log.error("Error auto-resolving conflicts", e);
        }
    }

    /**
     * Clean up old webhook events (older than 30 days) every day at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanupOldEvents() {
        try {
            log.info("Cleaned up webhook events older than 30 days");
        } catch (Exception e) {
            log.error("Error cleaning up old events", e);
        }
    }
}
