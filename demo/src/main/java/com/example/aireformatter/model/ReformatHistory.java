package com.example.aireformatter.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reformat_history")
public class ReformatHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String inputCode;

    @Column(columnDefinition = "TEXT")
    private String outputCode;

    private String language;
    private String mode;
    private int reductionPercent;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getInputCode() { return inputCode; }
    public void setInputCode(String inputCode) { this.inputCode = inputCode; }

    public String getOutputCode() { return outputCode; }
    public void setOutputCode(String outputCode) { this.outputCode = outputCode; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public int getReductionPercent() { return reductionPercent; }
    public void setReductionPercent(int reductionPercent) { this.reductionPercent = reductionPercent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}