package com.inventory.inventory_management.controller;

import com.inventory.inventory_management.entity.Movement;
import com.inventory.inventory_management.service.MovementService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movements")
@CrossOrigin(origins = "http://localhost:4200")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @GetMapping
    public List<Movement> getAllMovements() {
        return movementService.getAllMovements();
    }

    @PostMapping
    public Movement createMovement(@RequestBody Movement movement) {
        return movementService.createMovement(movement);
    }
}