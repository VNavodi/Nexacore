package com.nexacore.inventory.modules.inventory.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String sku;

    @NotBlank
    private String name;

    private String description;

    private String category;

    // Pricing fields
    @NotNull
    private Double costPrice;

    @NotNull
    private Double sellingPrice;

    private Double taxRate;

    private String taxType; // inclusive, exclusive, exempt

    // Stock fields
    @NotNull
    private Integer openingStock;

    private Integer reorderLevel;

    private String warehouse;

    private String unitOfMeasure;

    @NotNull
    private Integer stockQuantity;

    // Custom attributes stored as JSON
    @Column(columnDefinition = "json")
    private String customAttributes;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
