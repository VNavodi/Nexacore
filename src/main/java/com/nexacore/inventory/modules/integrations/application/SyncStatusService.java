package com.nexacore.inventory.modules.integrations.application;

import com.nexacore.inventory.modules.integrations.dto.SyncStatusResponse;
import com.nexacore.inventory.modules.integrations.infrastructure.SyncConflictRepository;
import com.nexacore.inventory.modules.integrations.infrastructure.SyncLogRepository;
import com.nexacore.inventory.modules.integrations.domain.SyncLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SyncStatusService {

    private final SyncLogRepository syncLogRepository;
    private final SyncConflictRepository syncConflictRepository;

    public SyncStatusResponse getSyncStatus(String source) {
        SyncLog lastSync = syncLogRepository.findFirstBySourceOrderBySyncedAtDesc(source);
        long conflictCount = syncConflictRepository.countByStatus("PENDING");

        String overallStatus = "HEALTHY";
        if (conflictCount > 10) {
            overallStatus = "CRITICAL";
        } else if (conflictCount > 0) {
            overallStatus = "DEGRADED";
        }

        LocalDateTime nextRetry = lastSync != null ? lastSync.getSyncedAt().plusHours(1) : LocalDateTime.now();

        return SyncStatusResponse.builder()
            .lastSync(lastSync != null ? lastSync.getSyncedAt() : null)
            .pendingCount(0) // TODO: Count pending webhooks
            .conflictCount((int) conflictCount)
            .overallStatus(overallStatus)
            .nextRetryTime(nextRetry)
            .build();
    }

    public List<SyncLog> getSyncHistory(String source, Integer limit) {
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        return syncLogRepository.findBySourceAndSyncedAtAfterOrderBySyncedAtDesc(source, since)
            .stream()
            .limit(limit != null ? limit : 100)
            .collect(Collectors.toList());
    }
}
