package com.nexacore.inventory.modules.integrations.api;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableAsync
@EnableScheduling
public class IntegrationConfig {
    // Async processing and scheduling are enabled here
    // Spring will automatically scan for @Async and @Scheduled methods
}
