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
        // Check if equipment already exists by name
        Equipment existing = equipmentRepository.findByName(equipment.getName());
        if (existing != null) {
            // Increase its quantity
            existing.setTotalQuantity(existing.getTotalQuantity() + equipment.getTotalQuantity());
            return equipmentRepository.save(existing);
        } else {
            // Add new equipment
            return equipmentRepository.save(equipment);
        }
    }

    public void delete(Long id) {
        equipmentRepository.deleteById(id);
    }
}
