package com.example.Backend_SpringBoot.repository;

import com.example.Backend_SpringBoot.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    boolean existsByName(String name);
    
    Equipment findByName(String name);
    
    // Case-insensitive search for equipment
    @Query("SELECT e FROM Equipment e WHERE LOWER(TRIM(e.name)) = LOWER(TRIM(?1))")
    Equipment findByNameIgnoreCase(String name);
}
