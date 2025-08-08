package com.example.demo.dto;


import java.util.Date;

public class AccountDTO {

    private Long accountNo;
    private AccountType accountType;
    private Date applicationDate;
    private AccountStatus status;
    private Double balance;
    private String transactionPassword;
    private Long customerId;

    public AccountDTO() {}

    public AccountDTO(Long accountNo, AccountType accountType, Date applicationDate,
                      AccountStatus status, Double balance, String transactionPassword, Long customerId) {
        this.accountNo = accountNo;
        this.accountType = accountType;
        this.applicationDate = applicationDate;
        this.status = status;
        this.balance = balance;
        this.transactionPassword = transactionPassword;
        this.customerId = customerId;
    }

    // --- Getters and Setters ---

    public Long getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(Long accountNo) {
        this.accountNo = accountNo;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public Date getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(Date applicationDate) {
        this.applicationDate = applicationDate;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public String getTransactionPassword() {
        return transactionPassword;
    }

    public void setTransactionPassword(String transactionPassword) {
        this.transactionPassword = transactionPassword;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}
