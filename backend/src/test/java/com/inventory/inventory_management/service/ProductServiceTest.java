package com.inventory.inventory_management.service;

import com.inventory.inventory_management.dto.ProductResponse;
import com.inventory.inventory_management.entity.Product;
import com.inventory.inventory_management.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.verify;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.inventory.inventory_management.dto.ProductRequest;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void shouldReturnAllProducts() {

        Product product = new Product();
        product.setId(1L);
        product.setName("Teclado Logitech");
        product.setDescription("Teclado inalámbrico");
        product.setPrice(new BigDecimal("85000"));
        product.setStock(20);

        when(productRepository.findAll()).thenReturn(List.of(product));

        List<ProductResponse> result = productService.getAllProducts();

        assertEquals(1, result.size());
        assertEquals("Teclado Logitech", result.get(0).getName());
        assertEquals(20, result.get(0).getStock());
    }
    @Test
    void shouldThrowExceptionWhenProductDoesNotExist() {

        when(productRepository.findById(99L)).thenReturn(java.util.Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(
                com.inventory.inventory_management.exception.ResourceNotFoundException.class,
                () -> productService.getProductById(99L)
        );
    }
    @Test
    void shouldCreateProductSuccessfully() {

        ProductRequest request = new ProductRequest();
        request.setName("Mouse Logitech");
        request.setDescription("Mouse inalámbrico");
        request.setPrice(new BigDecimal("45000"));
        request.setStock(15);

        Product savedProduct = new Product();
        savedProduct.setId(2L);
        savedProduct.setName("Mouse Logitech");
        savedProduct.setDescription("Mouse inalámbrico");
        savedProduct.setPrice(new BigDecimal("45000"));
        savedProduct.setStock(15);

        when(productRepository.save(any(Product.class)))
                .thenReturn(savedProduct);

        ProductResponse result = productService.createProduct(request);

        assertEquals(2L, result.getId());
        assertEquals("Mouse Logitech", result.getName());
        assertEquals(new BigDecimal("45000"), result.getPrice());
        assertEquals(15, result.getStock());
    }
    @Test
    void shouldUpdateProductSuccessfully() {

        Product existingProduct = new Product();
        existingProduct.setId(1L);
        existingProduct.setName("Teclado Logitech");
        existingProduct.setDescription("Teclado antiguo");
        existingProduct.setPrice(new BigDecimal("85000"));
        existingProduct.setStock(20);

        ProductRequest request = new ProductRequest();
        request.setName("Teclado Logitech actualizado");
        request.setDescription("Teclado inalámbrico nuevo");
        request.setPrice(new BigDecimal("95000"));
        request.setStock(30);

        when(productRepository.findById(1L))
                .thenReturn(java.util.Optional.of(existingProduct));

        when(productRepository.save(any(Product.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ProductResponse result = productService.updateProduct(1L, request);

        assertEquals(1L, result.getId());
        assertEquals("Teclado Logitech actualizado", result.getName());
        assertEquals("Teclado inalámbrico nuevo", result.getDescription());
        assertEquals(new BigDecimal("95000"), result.getPrice());
        assertEquals(30, result.getStock());
    }
    @Test
    void shouldDeleteProductSuccessfully() {

        Product existingProduct = new Product();
        existingProduct.setId(1L);
        existingProduct.setName("Teclado Logitech");

        when(productRepository.findById(1L))
                .thenReturn(java.util.Optional.of(existingProduct));

        productService.deleteProduct(1L);

        verify(productRepository).delete(existingProduct);
    }
}