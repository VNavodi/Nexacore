package com.nexacore.inventory.modules.integrations.application;

import com.nexacore.inventory.modules.integrations.domain.SyncConflict;
import com.nexacore.inventory.modules.integrations.infrastructure.SyncConflictRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConflictDetectionService {

    private final SyncConflictRepository syncConflictRepository;

    @Transactional
    public SyncConflict registerConflict(Long webhookEventId, String conflictType, String description,
                                        String expectedData, String actualData, Long productId, String sku) {
        log.warn("Registering conflict: type={}, product={}, webhook={}", conflictType, productId, webhookEventId);

        SyncConflict conflict = SyncConflict.builder()
            .webhookEventId(webhookEventId)
            .conflictType(conflictType)
            .description(description)
            .expectedData(expectedData)
            .actualData(actualData)
            .productId(productId)
            .sku(sku)
            .status("PENDING")
            .detectedAt(LocalDateTime.now())
            .build();

        return syncConflictRepository.save(conflict);
    }

    public List<SyncConflict> getPendingConflicts() {
        return syncConflictRepository.findByStatus("PENDING");
    }

    public SyncConflict getConflictDetail(Long conflictId) {
        return syncConflictRepository.findById(conflictId)
            .orElseThrow(() -> new RuntimeException("Conflict not found: " + conflictId));
    }

    @Transactional
    public SyncConflict resolveConflict(Long conflictId, String action, String customValue, String resolvedBy) {
        SyncConflict conflict = getConflictDetail(conflictId);

        log.info("Resolving conflict {} with action: {}", conflictId, action);
        conflict.setStatus("MANUAL_RESOLVED");
        conflict.setResolution(action);
        conflict.setResolvedBy(resolvedBy);
        conflict.setResolvedAt(LocalDateTime.now());

        // TODO: Apply resolution logic based on action
        // if (action.equals("accept_api")) { use conflict.expectedData }
        // if (action.equals("accept_local")) { use conflict.actualData }
        // if (action.equals("custom_value")) { use customValue }

        return syncConflictRepository.save(conflict);
    }

    @Transactional
    public void autoResolveCompatibleConflicts() {
        List<SyncConflict> pendingConflicts = getPendingConflicts();

        for (SyncConflict conflict : pendingConflicts) {
            // Auto-resolve minor pricing variances (< 1%)
            if (conflict.getConflictType().equals("PRICING_VARIANCE")) {
                try {
                    double expected = Double.parseDouble(conflict.getExpectedData());
                    double actual = Double.parseDouble(conflict.getActualData());
                    double variance = Math.abs((expected - actual) / expected);

                    if (variance < 0.01) { // Less than 1%
                        conflict.setStatus("ACCEPTED");
                        conflict.setResolution("auto_resolved_minor_variance");
                        conflict.setResolvedAt(LocalDateTime.now());
                        log.info("Auto-resolved pricing variance for conflict {}", conflict.getId());
                    }
                } catch (Exception e) {
                    log.debug("Could not auto-resolve pricing variance", e);
                }
            }
        }
        syncConflictRepository.saveAll(pendingConflicts);
    }
}
