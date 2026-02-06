//package com.example.Backend_SpringBoot.controller;
//
//import com.example.Backend_SpringBoot.model.Equipment;
//import com.example.Backend_SpringBoot.service.EquipmentService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//
//@RestController
//@CrossOrigin(origins = "http://localhost:5173")
//public class EquipmentController {
//
//    @Autowired private EquipmentService equipmentService;
//
//    // public: list all equipment (frontend expects GET /api/equipments)
//    @GetMapping("/api/equipments")
//    public List<Equipment> all() { return equipmentService.listAll(); }
//
//    // admin endpoints
//    @PostMapping("/api/admin/equipments")
//    public Equipment add(@RequestBody Equipment eq) { return equipmentService.add(eq); }
//
//    @DeleteMapping("/api/admin/equipments/{id}")
//    public void delete(@PathVariable Long id) { equipmentService.delete(id); }
//}

package com.example.Backend_SpringBoot.controller;

import com.example.Backend_SpringBoot.model.Equipment;
import com.example.Backend_SpringBoot.service.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    // ---------------- PUBLIC ----------------
    @GetMapping("/equipments")
    public List<Equipment> all() {
        return equipmentService.listAll();
    }

    // ---------------- ADMIN ----------------
    @PostMapping("/admin/equipments")
    public ResponseEntity<Equipment> addEquipment(@RequestBody Equipment equipment) {
        Equipment saved = equipmentService.addOrUpdateEquipment(equipment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/admin/equipments/{id}")
    public ResponseEntity<Equipment> updateEquipment(@PathVariable Long id, @RequestBody Equipment equipment) {
        Equipment updated = equipmentService.updateEquipmentQuantity(id, equipment.getTotalQuantity());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/admin/equipments/{id}")
    public void delete(@PathVariable Long id) {
        equipmentService.delete(id);
    }
}

