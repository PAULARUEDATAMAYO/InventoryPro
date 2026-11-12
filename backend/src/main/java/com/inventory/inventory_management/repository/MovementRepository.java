package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.entity.Movement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovementRepository extends JpaRepository<Movement, Long> {
}