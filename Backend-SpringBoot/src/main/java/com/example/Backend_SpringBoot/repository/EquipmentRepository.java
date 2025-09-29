package com.example.Backend_SpringBoot.repository;

import com.example.Backend_SpringBoot.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    boolean existsByName(String name);
    Equipment findByName(String name);
}
