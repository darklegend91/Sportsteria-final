package com.example.Backend_SpringBoot.repository;

import com.example.Backend_SpringBoot.model.RequestItem;
import com.example.Backend_SpringBoot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<RequestItem, Long> {
    List<RequestItem> findByStudent(User student);
}
