package com.example.Backend_SpringBoot.service;

import com.example.Backend_SpringBoot.model.Equipment;
import com.example.Backend_SpringBoot.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    public List<Equipment> listAll() {
        return equipmentRepository.findAll();
    }

    public Equipment addOrUpdateEquipment(Equipment equipment) {
        // Normalize the equipment name (trim and standardize)
        String normalizedName = equipment.getName().trim();
        
        // Check if equipment already exists by name (case-insensitive, whitespace-trimmed)
        Equipment existing = equipmentRepository.findByNameIgnoreCase(normalizedName);
        
        if (existing != null) {
            // Equipment already exists - increase its quantity instead of creating duplicate
            existing.setTotalQuantity(existing.getTotalQuantity() + equipment.getTotalQuantity());
            return equipmentRepository.save(existing);
        } else {
            // New equipment - standardize the name format (capitalize first letter of each word)
            equipment.setName(standardizeName(normalizedName));
            return equipmentRepository.save(equipment);
        }
    }

    /**
     * Standardize equipment name to Title Case (first letter uppercase, rest lowercase)
     * Example: "basket BALL" -> "Basketball"
     */
    private String standardizeName(String name) {
        if (name == null || name.isEmpty()) return name;
        
        String[] words = name.toLowerCase().trim().split("\\s+");
        StringBuilder standardized = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (i > 0) standardized.append(" ");
            String word = words[i];
            if (!word.isEmpty()) {
                standardized.append(word.substring(0, 1).toUpperCase())
                           .append(word.substring(1));
            }
        }
        
        return standardized.toString();
    }

    public void delete(Long id) {
        equipmentRepository.deleteById(id);
    }
}
