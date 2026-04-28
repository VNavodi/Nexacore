package com.nexacore.inventory.modules.integrations.application;

import com.nexacore.inventory.modules.integrations.domain.WebhookEvent;
import com.nexacore.inventory.modules.integrations.dto.WebhookOrderRequest;
import com.nexacore.inventory.modules.integrations.dto.WebhookResponse;
import com.nexacore.inventory.modules.integrations.infrastructure.WebhookEventRepository;
import com.nexacore.inventory.modules.integrations.infrastructure.SyncLogRepository;
import com.nexacore.inventory.modules.integrations.domain.SyncLog;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class WebhookService {

    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY_MS = 1000; // 1 second base delay

    private final WebhookEventRepository webhookEventRepository;
    private final SyncLogRepository syncLogRepository;

    public WebhookService(WebhookEventRepository webhookEventRepository, 
                         SyncLogRepository syncLogRepository) {
        this.webhookEventRepository = webhookEventRepository;
        this.syncLogRepository = syncLogRepository;
    }

    @Transactional
    public WebhookResponse processWebhook(String idempotencyKey, String source, 
                                         WebhookOrderRequest orderRequest, String payload) {
        log.info("Processing webhook from {} with idempotency key: {}", source, idempotencyKey);

        // Check for idempotency
        Optional<WebhookEvent> existingEvent = webhookEventRepository.findByIdempotencyKey(idempotencyKey);
        if (existingEvent.isPresent()) {
            WebhookEvent event = existingEvent.get();
            log.warn("Duplicate webhook detected for idempotency key: {}. Returning cached response.", idempotencyKey);
            
            return WebhookResponse.builder()
                .success(event.getStatus().equals("SUCCESS"))
                .message("Duplicate request - processed at " + event.getProcessedAt())
                .webhookEventId(event.getId().toString())
                .status(event.getStatus())
                .processedAt(event.getProcessedAt())
                .build();
        }

        // Create new webhook event
        WebhookEvent webhookEvent = WebhookEvent.builder()
            .idempotencyKey(idempotencyKey)
            .eventType("sales.order.created")
            .payload(payload)
            .source(source)
            .status("PENDING")
            .externalOrderId(orderRequest.getOrderId())
            .retryCount(0)
            .createdAt(LocalDateTime.now())
            .build();

        webhookEvent = webhookEventRepository.save(webhookEvent);
        log.info("Created webhook event {} with status PENDING", webhookEvent.getId());

        // Process asynchronously
        processWebhookAsync(webhookEvent, orderRequest);

        return WebhookResponse.builder()
            .success(true)
            .message("Webhook received and queued for processing")
            .webhookEventId(webhookEvent.getId().toString())
            .status("PENDING")
            .build();
    }

    @Async
    @Transactional
    public void processWebhookAsync(WebhookEvent webhookEvent, WebhookOrderRequest orderRequest) {
        long startTime = System.currentTimeMillis();
        try {
            log.info("Starting async processing of webhook event: {}", webhookEvent.getId());
            webhookEvent.setStatus("PROCESSING");
            webhookEventRepository.save(webhookEvent);

            // Process the order (stub - will call sales service)
            // TODO: Call SalesOrderService to create order
            // TODO: Call StockReservationService to reserve inventory

            webhookEvent.setStatus("SUCCESS");
            webhookEvent.setProcessedAt(LocalDateTime.now());
            webhookEventRepository.save(webhookEvent);

            long duration = System.currentTimeMillis() - startTime;
            log.info("Successfully processed webhook event {} in {}ms", webhookEvent.getId(), duration);

            // Log sync
            logSync(webhookEvent.getSource(), "SUCCESS", 1, 0, 0, duration);

        } catch (Exception e) {
            log.error("Error processing webhook event: {}", webhookEvent.getId(), e);
            handleWebhookError(webhookEvent, e);
        }
    }

    private void handleWebhookError(WebhookEvent webhookEvent, Exception e) {
        webhookEvent.setErrorMessage(e.getMessage());
        webhookEvent.setRetryCount(webhookEvent.getRetryCount() + 1);

        if (webhookEvent.getRetryCount() < MAX_RETRIES) {
            webhookEvent.setStatus("PENDING");
            long delayMs = (long) Math.pow(2, webhookEvent.getRetryCount()) * RETRY_DELAY_MS;
            webhookEvent.setLastRetryAt(LocalDateTime.now().plusSeconds(delayMs / 1000));
            log.info("Retrying webhook event {} (attempt {}/{})", 
                webhookEvent.getId(), webhookEvent.getRetryCount(), MAX_RETRIES);
        } else {
            webhookEvent.setStatus("FAILED");
            log.error("Webhook event {} failed after {} retries", webhookEvent.getId(), MAX_RETRIES);
        }
        webhookEventRepository.save(webhookEvent);
    }

    private void logSync(String source, String status, Integer ordersProcessed, 
                        Integer ordersSkipped, Integer conflictsDetected, Long durationMs) {
        SyncLog syncLog = SyncLog.builder()
            .source(source)
            .status(status)
            .ordersProcessed(ordersProcessed)
            .ordersSkipped(ordersSkipped)
            .conflictsDetected(conflictsDetected)
            .syncedAt(LocalDateTime.now())
            .completedAt(LocalDateTime.now())
            .durationMs(durationMs)
            .build();
        syncLogRepository.save(syncLog);
    }

    public List<WebhookEvent> getFailedEvents() {
        return webhookEventRepository.findByStatusAndRetryCountLessThan("PENDING", MAX_RETRIES);
    }
}
