package com.nexacore.inventory.integrations.controller;

import com.nexacore.inventory.integrations.dto.StockEventRequest;
import com.nexacore.inventory.integrations.dto.StockEventResponse;
import com.nexacore.inventory.integrations.dto.StockReconciliationRequest;
import com.nexacore.inventory.integrations.dto.StockReconciliationResponse;
import com.nexacore.inventory.stock.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/integrations")
public class IntegrationController {

    private final StockService stockService;

    public IntegrationController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping("/stock-events")
    public ResponseEntity<StockEventResponse> handleStockEvent(@Valid @RequestBody StockEventRequest request) {
        return ResponseEntity.ok(stockService.processStockEvent(request));
    }

    @PostMapping("/reconcile-stock")
    public ResponseEntity<StockReconciliationResponse> reconcileStock(@Valid @RequestBody StockReconciliationRequest request) {
        return ResponseEntity.ok(stockService.reconcileStock(request.sourceSystem(), request.sku(), request.expectedQuantity()));
    }
}
