package com.nexacore.inventory.modules.integrations.infrastructure;

import com.nexacore.inventory.modules.integrations.domain.SyncLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SyncLogRepository extends JpaRepository<SyncLog, Long> {
    List<SyncLog> findBySourceOrderBySyncedAtDesc(String source);
    List<SyncLog> findBySourceAndSyncedAtAfterOrderBySyncedAtDesc(String source, LocalDateTime since);
    SyncLog findFirstBySourceOrderBySyncedAtDesc(String source);
}
