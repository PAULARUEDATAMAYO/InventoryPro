package com.inventory.inventory_management.service;

import com.inventory.inventory_management.entity.Movement;
import com.inventory.inventory_management.entity.Product;
import com.inventory.inventory_management.repository.MovementRepository;
import com.inventory.inventory_management.repository.ProductRepository;
import com.inventory.inventory_management.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovementService {

    private final MovementRepository movementRepository;
    private final ProductRepository productRepository;

    public MovementService(
            MovementRepository movementRepository,
            ProductRepository productRepository) {
        this.movementRepository = movementRepository;
        this.productRepository = productRepository;
    }

    public List<Movement> getAllMovements() {
        return movementRepository.findAll();
    }

    @Transactional
    public Movement createMovement(Movement movement) {

        Product product = productRepository.findById(
                movement.getProduct().getId()
        ).orElseThrow(() ->
                new ResourceNotFoundException("Producto no encontrado")
        );

        if (movement.getQuantity() == null || movement.getQuantity() <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor que cero");
        }

        if ("ENTRADA".equalsIgnoreCase(movement.getType())) {
            product.setStock(product.getStock() + movement.getQuantity());

        } else if ("SALIDA".equalsIgnoreCase(movement.getType())) {

            if (product.getStock() < movement.getQuantity()) {
                throw new IllegalArgumentException(
                        "No hay suficiente stock para realizar esta salida"
                );
            }

            product.setStock(product.getStock() - movement.getQuantity());

        } else {
            throw new IllegalArgumentException(
                    "El tipo de movimiento debe ser ENTRADA o SALIDA"
            );
        }

        productRepository.save(product);

        movement.setProduct(product);
        movement.setDate(LocalDateTime.now());

        return movementRepository.save(movement);
    }
}