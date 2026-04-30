package com.nexacore.inventory.modules.reports.controller;

import com.nexacore.inventory.modules.inventory.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reporting")
public class ReportingController {

    private final ProductRepository productRepository;

    public ReportingController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        long totalProducts = productRepository.count();
        long lowStockProducts = productRepository.findByStockOnHandLessThan(10).size();

        return ResponseEntity.ok(Map.of(
            "totalProducts", totalProducts,
            "lowStockProducts", lowStockProducts
        ));
    }
}
