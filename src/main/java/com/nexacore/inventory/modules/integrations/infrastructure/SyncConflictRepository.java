package com.nexacore.inventory.modules.integrations.infrastructure;

import com.nexacore.inventory.modules.integrations.domain.SyncConflict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyncConflictRepository extends JpaRepository<SyncConflict, Long> {
    List<SyncConflict> findByStatus(String status);
    List<SyncConflict> findByWebhookEventId(Long webhookEventId);
    List<SyncConflict> findByStatusAndProductId(String status, Long productId);
    Long countByStatus(String status);
}
