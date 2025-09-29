package com.example.Backend_SpringBoot.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private Long id;

    @Column(nullable = false, unique = true)
    @Getter @Setter
    private String name;

    @Column(nullable = false)
    @Getter @Setter
    private Integer totalQuantity = 0;

    @Column(nullable = false)
    @Getter @Setter
    private Integer allottedQuantity = 0;

    public int getAvailable() {
        // Handles nulls just in case
        int total = totalQuantity != null ? totalQuantity : 0;
        int allotted = allottedQuantity != null ? allottedQuantity : 0;
        return Math.max(0, total - allotted);
    }
}