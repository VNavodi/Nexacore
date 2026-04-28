package com.nexacore.inventory.modules.settings.repository;

import com.nexacore.inventory.modules.settings.model.ApplicationSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationSettingsRepository extends JpaRepository<ApplicationSettings, Long> {
    Optional<ApplicationSettings> findFirstByOrderByIdAsc();
}