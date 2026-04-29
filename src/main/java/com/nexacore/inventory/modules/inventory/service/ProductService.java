package com.nexacore.inventory.modules.inventory.service;

import com.nexacore.inventory.modules.inventory.dto.ProductRequest;
import com.nexacore.inventory.modules.inventory.model.Product;
import com.nexacore.inventory.modules.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
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
                .category(request.category())
                .costPrice(request.costPrice())
                .sellingPrice(request.sellingPrice())
                .reorderLevel(request.reorderLevel())
                .stockOnHand(request.openingStock())
                .build();
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product existing = getProductById(id);
        existing.setSku(request.sku());
        existing.setName(request.name());
        existing.setCategory(request.category());
        existing.setCostPrice(request.costPrice());
        existing.setSellingPrice(request.sellingPrice());
        existing.setReorderLevel(request.reorderLevel());
        existing.setStockOnHand(request.openingStock());
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findByStockOnHandLessThan(10);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Product getBySku(String sku) {
        return productRepository.findBySku(sku)
            .orElseThrow(() -> new RuntimeException("Product not found with sku: " + sku));
    }
}
