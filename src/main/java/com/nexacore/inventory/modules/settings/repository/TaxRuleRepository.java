package com.nexacore.inventory.modules.settings.repository;

import com.nexacore.inventory.modules.settings.model.TaxRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaxRuleRepository extends JpaRepository<TaxRule, Long> {
}