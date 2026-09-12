package com.example.aireformatter.dto;

public class ReformatResponse {
    private String reformattedCode;
    private int inputLines;
    private int outputLines;
    private int inputChars;
    private int outputChars;
    private int reductionPercent;

    // Getters and Setters
    public String getReformattedCode() { return reformattedCode; }
    public void setReformattedCode(String reformattedCode) { this.reformattedCode = reformattedCode; }

    public int getInputLines() { return inputLines; }
    public void setInputLines(int inputLines) { this.inputLines = inputLines; }

    public int getOutputLines() { return outputLines; }
    public void setOutputLines(int outputLines) { this.outputLines = outputLines; }

    public int getInputChars() { return inputChars; }
    public void setInputChars(int inputChars) { this.inputChars = inputChars; }

    public int getOutputChars() { return outputChars; }
    public void setOutputChars(int outputChars) { this.outputChars = outputChars; }

    public int getReductionPercent() { return reductionPercent; }
    public void setReductionPercent(int reductionPercent) { this.reductionPercent = reductionPercent; }
}