package com.example.aireformatter.dto;

public class ReformatRequest {
    private String code;
    private String language;
    private String mode;

    // Getters and Setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
}