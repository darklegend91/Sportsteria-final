package com.example.Backend_SpringBoot.service;

import com.example.Backend_SpringBoot.model.*;
import com.example.Backend_SpringBoot.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    // ------------------ LIST ALL REQUESTS ------------------
    public List<RequestItem> listAll() {
        return requestRepository.findAll();
    }

    // ------------------ LIST REQUESTS FOR STUDENT ------------------
    public List<RequestItem> listForStudent(User student) {
        return requestRepository.findByStudent(student);
    }

    // ------------------ CREATE STUDENT REQUEST ------------------
    @Transactional
    public RequestItem createRequest(Long studentId, Long equipmentId, int qty) {
        try {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            Equipment equipment = equipmentRepository.findById(equipmentId)
                    .orElseThrow(() -> new RuntimeException("Equipment not found"));

            if (equipment.getAvailable() < qty) {
                throw new RuntimeException("Not enough equipment available");
            }

            RequestItem request = new RequestItem();
            request.setStudent(student);
            request.setEquipment(equipment);
            request.setQuantityRequested(qty);
            request.setStatus(RequestStatus.PENDING);

            return requestRepository.save(request);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create request: " + e.getMessage(), e);
        }
    }

    // ------------------ CHANGE STATUS (APPROVE/REJECT) ------------------
    @Transactional
    public RequestItem changeStatus(Long requestId, RequestStatus status) {
        try {
            RequestItem request = requestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            if (request.getStatus() != RequestStatus.PENDING) return request;

            request.setStatus(status);

            if (status == RequestStatus.APPROVED) {
                Equipment eq = request.getEquipment();
                if (eq == null) throw new RuntimeException("Request has no equipment assigned");

                int newAllotted = eq.getAllottedQuantity() + request.getQuantityRequested();
                if (newAllotted > eq.getTotalQuantity()) {
                    throw new RuntimeException("Not enough equipment available to approve this request");
                }

                eq.setAllottedQuantity(newAllotted);
                equipmentRepository.save(eq); // fails if DB is down
            }

            return requestRepository.save(request);

        } catch (Exception e) {
            throw new RuntimeException("Failed to change request status: " + e.getMessage(), e);
        }
    }
}

