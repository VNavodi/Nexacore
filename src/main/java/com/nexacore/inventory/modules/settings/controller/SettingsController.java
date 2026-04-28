package com.nexacore.inventory.modules.settings.controller;

import com.nexacore.inventory.modules.settings.dto.ApplicationSettingsRequest;
import com.nexacore.inventory.modules.settings.dto.ApplicationSettingsResponse;
import com.nexacore.inventory.modules.settings.dto.TaxRuleRequest;
import com.nexacore.inventory.modules.settings.dto.TaxRuleResponse;
import com.nexacore.inventory.modules.settings.service.SettingsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<ApplicationSettingsResponse> getSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @PutMapping
    public ResponseEntity<ApplicationSettingsResponse> updateSettings(@Valid @RequestBody ApplicationSettingsRequest request) {
        return ResponseEntity.ok(settingsService.updateSettings(request));
    }

    @GetMapping("/tax-rules")
    public ResponseEntity<List<TaxRuleResponse>> getTaxRules() {
        return ResponseEntity.ok(settingsService.getTaxRules());
    }

    @PostMapping("/tax-rules")
    public ResponseEntity<TaxRuleResponse> createTaxRule(@Valid @RequestBody TaxRuleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(settingsService.createTaxRule(request));
    }

    @PutMapping("/tax-rules/{id}")
    public ResponseEntity<TaxRuleResponse> updateTaxRule(@PathVariable Long id, @Valid @RequestBody TaxRuleRequest request) {
        return ResponseEntity.ok(settingsService.updateTaxRule(id, request));
    }

    @DeleteMapping("/tax-rules/{id}")
    public ResponseEntity<Void> deleteTaxRule(@PathVariable Long id) {
        settingsService.deleteTaxRule(id);
        return ResponseEntity.noContent().build();
    }
}