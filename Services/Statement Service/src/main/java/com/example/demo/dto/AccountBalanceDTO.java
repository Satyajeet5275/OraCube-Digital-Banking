package com.example.demo.dto;

import java.math.BigDecimal;

public class AccountBalanceDTO {

    private Long accountNo;
    private BigDecimal availableBalance;
    private BigDecimal effectiveBalance; 

    // ✅ Constructor
    public AccountBalanceDTO(Long accountNo, BigDecimal availableBalance,BigDecimal effectiveBalance) {
        this.accountNo = accountNo;
        this.availableBalance = availableBalance;
        this.effectiveBalance = availableBalance;
    }

    // ✅ Default constructor (optional but good for serialization/deserialization)
    public AccountBalanceDTO() {
    }

    // ✅ Getters and Setters

    public Long getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(Long accountNo) {
        this.accountNo = accountNo;
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
