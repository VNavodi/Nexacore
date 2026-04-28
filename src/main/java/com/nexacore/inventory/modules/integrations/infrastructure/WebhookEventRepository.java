package com.nexacore.inventory.modules.integrations.infrastructure;

import com.nexacore.inventory.modules.integrations.domain.WebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WebhookEventRepository extends JpaRepository<WebhookEvent, Long> {
    Optional<WebhookEvent> findByIdempotencyKey(String idempotencyKey);
    List<WebhookEvent> findByStatus(String status);
    List<WebhookEvent> findByStatusAndRetryCountLessThan(String status, Integer maxRetries);
    List<WebhookEvent> findBySourceAndCreatedAtAfter(String source, LocalDateTime since);
    Long countByStatusAndCreatedAtAfter(String status, LocalDateTime since);
}
