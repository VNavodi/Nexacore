package com.nexacore.inventory.modules.integrations.api;

import com.nexacore.inventory.modules.integrations.application.*;
import com.nexacore.inventory.modules.integrations.domain.SyncConflict;
import com.nexacore.inventory.modules.integrations.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class WebhookIntegrationController {

    private final WebhookService webhookService;
    private final HmacVerificationService hmacVerificationService;
    private final SyncStatusService syncStatusService;
    private final ConflictDetectionService conflictDetectionService;
    private final ObjectMapper objectMapper;

    /**
     * POST /api/v1/sales/webhook
     * Ingest external orders from POS/Website in real-time with idempotency support
     */
    @PostMapping("/sales/webhook")
    public ResponseEntity<WebhookResponse> handleSalesWebhook(
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @RequestHeader("X-Signature") String signature,
            @RequestHeader(value = "X-Source", defaultValue = "POS") String source,
            @RequestBody WebhookOrderRequest orderRequest) {
        
        log.info("Received webhook from {} with order: {}", source, orderRequest.getOrderId());

        try {
            // Verify HMAC signature
            String payload = objectMapper.writeValueAsString(orderRequest);
            if (!hmacVerificationService.verifySignature(payload, signature)) {
                log.warn("Invalid HMAC signature from {}", source);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(WebhookResponse.builder()
                        .success(false)
                        .message("Invalid signature")
                        .build());
            }

            // Process webhook with idempotency
            WebhookResponse response = webhookService.processWebhook(idempotencyKey, source, orderRequest, payload);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error processing webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(WebhookResponse.builder()
                    .success(false)
                    .message("Error processing webhook: " + e.getMessage())
                    .build());
        }
    }

    /**
     * GET /api/v1/sync/status
     * Check queue/conflicts for UI dashboard
     */
    @GetMapping("/sync/status")
    public ResponseEntity<SyncStatusResponse> getSyncStatus(
            @RequestParam(value = "source", defaultValue = "POS") String source) {
        
        log.info("Fetching sync status for {}", source);
        SyncStatusResponse status = syncStatusService.getSyncStatus(source);
        return ResponseEntity.ok(status);
    }

    /**
     * GET /api/v1/sync/conflicts
     * List all pending conflicts
     */
    @GetMapping("/sync/conflicts")
    public ResponseEntity<List<SyncConflict>> getPendingConflicts() {
        log.info("Fetching pending conflicts");
        List<SyncConflict> conflicts = conflictDetectionService.getPendingConflicts();
        return ResponseEntity.ok(conflicts);
    }

    /**
     * GET /api/v1/sync/conflicts/{id}
     * Get detail of a specific conflict
     */
    @GetMapping("/sync/conflicts/{id}")
    public ResponseEntity<SyncConflict> getConflictDetail(@PathVariable Long id) {
        log.info("Fetching conflict detail: {}", id);
        SyncConflict conflict = conflictDetectionService.getConflictDetail(id);
        return ResponseEntity.ok(conflict);
    }

    /**
     * POST /api/v1/sync/conflicts/{id}/resolve
     * Manual resolution from UI with accept_api, accept_local, or custom_value
     */
    @PostMapping("/sync/conflicts/{id}/resolve")
    public ResponseEntity<ConflictResolutionResponse> resolveConflict(
            @PathVariable Long id,
            @RequestBody ConflictResolutionRequest request,
            @RequestHeader(value = "X-User", defaultValue = "system") String userId) {
        
        log.info("Resolving conflict {} with action: {}", id, request.getAction());

        try {
            SyncConflict resolved = conflictDetectionService.resolveConflict(
                id, 
                request.getAction(), 
                request.getCustomValue(),
                userId
            );

            return ResponseEntity.ok(ConflictResolutionResponse.builder()
                .success(true)
                .message("Conflict resolved")
                .conflictId(id)
                .resolvedAt(resolved.getResolvedAt())
                .build());

        } catch (Exception e) {
            log.error("Error resolving conflict", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ConflictResolutionResponse.builder()
                    .success(false)
                    .message("Error resolving conflict: " + e.getMessage())
                    .build());
        }
    }

    /**
     * GET /api/v1/products
     * CRUD for items - fetch catalog for POS
     */
    @GetMapping("/integrations/products")
    public ResponseEntity<?> getProducts(
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "status", required = false) String status) {
        
        log.info("Fetching products - sku: {}, status: {}", sku, status);
        // TODO: Implement product catalog endpoint
        return ResponseEntity.ok("[]");
    }

    @PostMapping("/integrations/products")
    public ResponseEntity<?> createProduct(@RequestBody Object product) {
        log.info("Creating product");
        // TODO: Implement product creation
        return ResponseEntity.status(HttpStatus.CREATED).body("{}");
    }

    @PutMapping("/integrations/products/{id}")
    public ResponseEntity<?> updateIntegrationProduct(@PathVariable Long id, @RequestBody Object product) {
        log.info("Updating integration product: {}", id);
        // TODO: Implement product update
        return ResponseEntity.ok("{}");
    }

    @DeleteMapping("/integrations/products/{id}")
    public ResponseEntity<?> deleteIntegrationProduct(@PathVariable Long id) {
        log.info("Deleting integration product: {}", id);
        // TODO: Implement product deletion
        return ResponseEntity.noContent().build();
    }
}
