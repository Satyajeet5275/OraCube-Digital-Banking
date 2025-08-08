package com.example.demo.dto;

import java.math.BigDecimal;

public class AccountSummaryDTO {
    private Long accountNo;
    private String accountHolderName;
    private BigDecimal availableBalance;
    private BigDecimal effectiveBalance;

    public AccountSummaryDTO() {}

    public AccountSummaryDTO(Long accountNo, String accountHolderName,
                             BigDecimal availableBalance, BigDecimal effectiveBalance) {
        this.accountNo = accountNo;
        this.accountHolderName = accountHolderName;
        this.availableBalance = availableBalance;
        this.effectiveBalance = effectiveBalance;
    }

    // Getters and setters
    public Long getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(Long accountNo) {
        this.accountNo = accountNo;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

    public BigDecimal getAvailableBalance() {
        return availableBalance;
    }

    public void setAvailableBalance(BigDecimal availableBalance) {
        this.availableBalance = availableBalance;
    }

    public BigDecimal getEffectiveBalance() {
        return effectiveBalance;
    }

    public void setEffectiveBalance(BigDecimal effectiveBalance) {
        this.effectiveBalance = effectiveBalance;
    }
}
