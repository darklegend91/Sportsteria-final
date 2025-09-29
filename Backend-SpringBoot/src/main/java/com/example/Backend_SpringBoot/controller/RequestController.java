package com.example.Backend_SpringBoot.controller;

import com.example.Backend_SpringBoot.model.RequestItem;
import com.example.Backend_SpringBoot.model.RequestStatus;
import com.example.Backend_SpringBoot.repository.UserRepository;
import com.example.Backend_SpringBoot.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private UserRepository userRepository;

    // ---------------- STUDENT ----------------
    @GetMapping("/requests/student")
    public List<RequestItem> getMyRequests(@AuthenticationPrincipal UserDetails ud) {
        var student = userRepository.findByUsername(ud.getUsername()).orElseThrow();
        return requestService.listForStudent(student);
    }

    @PostMapping("/requests/student")
    public RequestItem createRequest(@AuthenticationPrincipal UserDetails ud,
                                     @RequestBody CreateRequestDTO dto) {
        var student = userRepository.findByUsername(ud.getUsername()).orElseThrow();
        int qty = dto.quantityRequested() == null ? 1 : dto.quantityRequested();
        return requestService.createRequest(student.getId(), dto.equipmentId(), qty);
    }

    public static record CreateRequestDTO(Long equipmentId, Integer quantityRequested) {}

    // ---------------- ADMIN ----------------
    @GetMapping("/admin/requests")
    public List<RequestItem> getAllRequests() {
        return requestService.listAll();
    }

    @PutMapping("/admin/requests/{id}/approve")
    public RequestItem approveRequest(@PathVariable Long id) {
        return requestService.changeStatus(id, RequestStatus.APPROVED);
    }

    @PutMapping("/admin/requests/{id}/reject")
    public RequestItem rejectRequest(@PathVariable Long id) {
        return requestService.changeStatus(id, RequestStatus.REJECTED);
    }
}
