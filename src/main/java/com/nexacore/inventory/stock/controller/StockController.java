package com.nexacore.inventory.stock.controller;

import com.nexacore.inventory.stock.dto.StockAdjustmentRequest;
import com.nexacore.inventory.stock.service.StockService;
import com.nexacore.inventory.products.model.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/inventory")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PatchMapping("/stock-adjustments")
    public ResponseEntity<Product> adjustStock(@RequestBody StockAdjustmentRequest request) {
        return ResponseEntity.ok(stockService.applyStockAdjustment(request));
    }
}
