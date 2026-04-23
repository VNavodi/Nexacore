package com.nexacore.inventory.repository;

import com.nexacore.inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    Optional<Product> findBySku(String sku);
    List<Product> findByStockQuantityLessThan(Integer threshold);
}