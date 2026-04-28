package com.nexacore.inventory.modules.integrations.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class HmacVerificationService {

    @Value("${api.webhook.secret:your-secret-key}")
    private String webhookSecret;

    public boolean verifySignature(String payload, String signature) {
        try {
            String expectedSignature = generateSignature(payload);
            boolean isValid = expectedSignature.equals(signature);
            if (!isValid) {
                log.warn("Invalid HMAC signature detected. Expected: {}, Got: {}", 
                    expectedSignature.substring(0, 10) + "...",
                    signature.substring(0, 10) + "...");
            }
            return isValid;
        } catch (Exception e) {
            log.error("Error verifying signature", e);
            return false;
        }
    }

    public String generateSignature(String payload) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(
            webhookSecret.getBytes(StandardCharsets.UTF_8),
            0,
            webhookSecret.getBytes(StandardCharsets.UTF_8).length,
            "HmacSHA256"
        );
        mac.init(secretKey);
        byte[] hmacHash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hmacHash);
    }
}
