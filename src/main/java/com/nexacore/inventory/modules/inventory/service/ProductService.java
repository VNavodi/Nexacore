package com.nexacore.inventory.modules.inventory.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexacore.inventory.modules.inventory.dto.ProductRequest;
import com.nexacore.inventory.modules.inventory.model.Product;
import com.nexacore.inventory.modules.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    public ProductService(ProductRepository productRepository, ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product createProductFromRequest(ProductRequest request) {
        Product product = Product.builder()
                .sku(request.sku())
                .name(request.name())
                .description(request.description())
                .category(request.category())
                .costPrice(request.costPrice())
                .sellingPrice(request.sellingPrice())
                .taxRate(request.taxRate())
                .taxType(request.taxType())
                .openingStock(request.openingStock())
                .reorderLevel(request.reorderLevel())
                .warehouse(request.warehouse())
                .unitOfMeasure(request.unitOfMeasure())
                .stockQuantity(request.openingStock())
                .customAttributes(convertMapToJson(request.customAttributes()))
                .build();
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product existing = getProductById(id);
        existing.setSku(request.sku());
        existing.setName(request.name());
        existing.setDescription(request.description());
        existing.setCategory(request.category());
        existing.setCostPrice(request.costPrice());
        existing.setSellingPrice(request.sellingPrice());
        existing.setTaxRate(request.taxRate());
        existing.setTaxType(request.taxType());
        existing.setOpeningStock(request.openingStock());
        existing.setReorderLevel(request.reorderLevel());
        existing.setWarehouse(request.warehouse());
        existing.setUnitOfMeasure(request.unitOfMeasure());
        existing.setCustomAttributes(convertMapToJson(request.customAttributes()));
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findByStockQuantityLessThan(10);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Product getBySku(String sku) {
        return productRepository.findBySku(sku)
            .orElseThrow(() -> new RuntimeException("Product not found with sku: " + sku));
    }

    /**
     * Convert Map to JSON string for storage
     */
    private String convertMapToJson(Map<String, String> map) {
        if (map == null || map.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            throw new RuntimeException("Error converting custom attributes to JSON", e);
        }
    }

    /**
     * Convert JSON string to Map for API response
     */
    public Map<String, String> convertJsonToMap(String json) {
        if (json == null || json.isEmpty()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing custom attributes JSON", e);
        }
    }
}
