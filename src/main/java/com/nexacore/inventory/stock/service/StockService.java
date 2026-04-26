package com.nexacore.inventory.stock.service;

import com.nexacore.inventory.integrations.dto.StockEventRequest;
import com.nexacore.inventory.integrations.dto.StockEventResponse;
import com.nexacore.inventory.integrations.dto.StockEventType;
import com.nexacore.inventory.integrations.dto.StockReconciliationResponse;
import com.nexacore.inventory.products.model.Product;
import com.nexacore.inventory.products.repository.ProductRepository;
import com.nexacore.inventory.stock.dto.StockAdjustmentRequest;
import com.nexacore.inventory.stock.model.StockMovement;
import com.nexacore.inventory.stock.repository.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class StockService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    public StockService(ProductRepository productRepository, StockMovementRepository stockMovementRepository) {
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @Transactional
    public Product applyStockAdjustment(StockAdjustmentRequest request) {
        StockEventType eventType = mapLegacyOperation(request.operation());
        StockEventRequest eventRequest = new StockEventRequest(
            "INTERNAL",
            UUID.randomUUID().toString(),
            eventType,
            request.sku(),
            request.quantity(),
            OffsetDateTime.now()
        );

        processStockEvent(eventRequest);
        return productRepository.findBySku(request.sku())
            .orElseThrow(() -> new RuntimeException("Product not found with sku: " + request.sku()));
    }

    @Transactional
    public StockEventResponse processStockEvent(StockEventRequest request) {
        if (request.quantity() == null || request.quantity() == 0) {
            throw new IllegalArgumentException("Quantity must not be zero");
        }

        if (request.eventType() != StockEventType.ADJUSTMENT && request.quantity() < 0) {
            throw new IllegalArgumentException("Quantity must be positive for SALE, PURCHASE, and RETURN events");
        }

        return stockMovementRepository.findByEventId(request.eventId())
            .map(existing -> new StockEventResponse(
                "duplicate",
                true,
                "Event already processed",
                existing.getSourceSystem(),
                existing.getEventId(),
                existing.getEventType(),
                existing.getSku(),
                existing.getQuantity(),
                existing.getBeforeStock(),
                existing.getAfterStock(),
                existing.getOccurredAt(),
                existing.getProcessedAt()
            ))
            .orElseGet(() -> applyNewEvent(request));
    }

    public StockReconciliationResponse reconcileStock(String sourceSystem, String sku, Integer expectedQuantity) {
        Product product = productRepository.findBySku(sku)
            .orElseThrow(() -> new RuntimeException("Product not found with sku: " + sku));

        int actualQuantity = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
        int difference = actualQuantity - expectedQuantity;
        boolean match = difference == 0;

        return new StockReconciliationResponse(
            match ? "matched" : "mismatch",
            sku,
            expectedQuantity,
            actualQuantity,
            difference,
            match,
            sourceSystem,
            match ? "Stock is in sync" : "Stock mismatch detected"
        );
    }

    private StockEventResponse applyNewEvent(StockEventRequest request) {
        Product product = productRepository.findBySku(request.sku())
            .orElseThrow(() -> new RuntimeException("Product not found with sku: " + request.sku()));

        int beforeStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
        int delta = calculateDelta(request.eventType(), request.quantity());
        int afterStock = beforeStock + delta;

        if (afterStock < 0) {
            throw new IllegalArgumentException("Stock cannot go below zero");
        }

        product.setStockQuantity(afterStock);
        Product savedProduct = productRepository.save(product);

        StockMovement movement = StockMovement.builder()
            .eventId(request.eventId())
            .sourceSystem(request.sourceSystem())
            .eventType(request.eventType())
            .sku(request.sku())
            .quantity(request.quantity())
            .beforeStock(beforeStock)
            .afterStock(savedProduct.getStockQuantity())
            .occurredAt(request.occurredAt())
            .build();

        StockMovement savedMovement = stockMovementRepository.save(movement);

        return new StockEventResponse(
            "updated",
            false,
            "Stock updated successfully",
            savedMovement.getSourceSystem(),
            savedMovement.getEventId(),
            savedMovement.getEventType(),
            savedMovement.getSku(),
            savedMovement.getQuantity(),
            savedMovement.getBeforeStock(),
            savedMovement.getAfterStock(),
            savedMovement.getOccurredAt(),
            savedMovement.getProcessedAt()
        );
    }

    private int calculateDelta(StockEventType eventType, Integer quantity) {
        return switch (eventType) {
            case PURCHASE, RETURN -> quantity;
            case SALE -> -quantity;
            case ADJUSTMENT -> quantity;
        };
    }

    private StockEventType mapLegacyOperation(String operation) {
        String normalized = operation == null ? "" : operation.trim().toLowerCase();
        return switch (normalized) {
            case "increase" -> StockEventType.PURCHASE;
            case "decrease" -> StockEventType.SALE;
            case "adjust", "adjustment" -> StockEventType.ADJUSTMENT;
            default -> throw new IllegalArgumentException("Operation must be increase, decrease, adjust, or adjustment");
        };
    }
}
