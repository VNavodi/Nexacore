package com.nexacore.inventory.modules.settings.service;

import com.nexacore.inventory.modules.settings.dto.ApplicationSettingsRequest;
import com.nexacore.inventory.modules.settings.dto.ApplicationSettingsResponse;
import com.nexacore.inventory.modules.settings.dto.TaxRuleRequest;
import com.nexacore.inventory.modules.settings.dto.TaxRuleResponse;
import com.nexacore.inventory.modules.settings.model.ApplicationSettings;
import com.nexacore.inventory.modules.settings.model.TaxRule;
import com.nexacore.inventory.modules.settings.repository.ApplicationSettingsRepository;
import com.nexacore.inventory.modules.settings.repository.TaxRuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SettingsService {

    private final ApplicationSettingsRepository applicationSettingsRepository;
    private final TaxRuleRepository taxRuleRepository;

    public SettingsService(ApplicationSettingsRepository applicationSettingsRepository,
                           TaxRuleRepository taxRuleRepository) {
        this.applicationSettingsRepository = applicationSettingsRepository;
        this.taxRuleRepository = taxRuleRepository;
    }

    public ApplicationSettingsResponse getSettings() {
        return toResponse(getOrCreateSettings());
    }

    public ApplicationSettingsResponse updateSettings(ApplicationSettingsRequest request) {
        ApplicationSettings settings = getOrCreateSettings();
        settings.setCompanyName(request.companyName());
        settings.setDefaultCurrency(request.defaultCurrency());
        settings.setLanguage(request.language());
        settings.setTimezone(request.timezone());
        settings.setNotificationEmail(request.notificationEmail());
        settings.setLowStockThreshold(request.lowStockThreshold());
        settings.setLowStockAlertsEnabled(request.lowStockAlertsEnabled());
        settings.setBackupEnabled(request.backupEnabled());
        settings.setSyncEnabled(request.syncEnabled());
        return toResponse(applicationSettingsRepository.save(settings));
    }

    public List<TaxRuleResponse> getTaxRules() {
        return taxRuleRepository.findAll().stream().map(this::toResponse).toList();
    }

    public TaxRuleResponse createTaxRule(TaxRuleRequest request) {
        TaxRule rule = TaxRule.builder()
            .name(request.name())
            .rate(request.rate())
            .appliesTo(request.appliesTo())
            .active(request.active())
            .build();
        return toResponse(taxRuleRepository.save(rule));
    }

    public TaxRuleResponse updateTaxRule(Long id, TaxRuleRequest request) {
        TaxRule rule = taxRuleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tax rule not found with id: " + id));
        rule.setName(request.name());
        rule.setRate(request.rate());
        rule.setAppliesTo(request.appliesTo());
        rule.setActive(request.active());
        return toResponse(taxRuleRepository.save(rule));
    }

    public void deleteTaxRule(Long id) {
        if (!taxRuleRepository.existsById(id)) {
            throw new RuntimeException("Tax rule not found with id: " + id);
        }
        taxRuleRepository.deleteById(id);
    }

    private ApplicationSettings getOrCreateSettings() {
        return applicationSettingsRepository.findFirstByOrderByIdAsc()
            .orElseGet(() -> applicationSettingsRepository.save(ApplicationSettings.builder()
                .companyName("Nexacore")
                .defaultCurrency("LKR")
                .language("en")
                .timezone("Asia/Colombo")
                .notificationEmail("admin@nexacore.local")
                .lowStockThreshold(10)
                .lowStockAlertsEnabled(true)
                .backupEnabled(true)
                .syncEnabled(true)
                .build()));
    }

    private ApplicationSettingsResponse toResponse(ApplicationSettings settings) {
        return new ApplicationSettingsResponse(
            settings.getId(),
            settings.getCompanyName(),
            settings.getDefaultCurrency(),
            settings.getLanguage(),
            settings.getTimezone(),
            settings.getNotificationEmail(),
            settings.getLowStockThreshold(),
            settings.getLowStockAlertsEnabled(),
            settings.getBackupEnabled(),
            settings.getSyncEnabled(),
            settings.getCreatedAt(),
            settings.getUpdatedAt()
        );
    }

    private TaxRuleResponse toResponse(TaxRule rule) {
        return new TaxRuleResponse(
            rule.getId(),
            rule.getName(),
            rule.getRate(),
            rule.getAppliesTo(),
            rule.getActive(),
            rule.getCreatedAt(),
            rule.getUpdatedAt()
        );
    }
}