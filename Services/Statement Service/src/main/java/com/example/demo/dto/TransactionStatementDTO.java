package com.example.demo.dto;

import java.math.BigDecimal;

public class TransactionStatementDTO {

    private Long transactionId;
    private String transactionDate; // formatted as String
    private String transactionType;
    private String paymentMethod;
    private String remarks;
    private BigDecimal amount;
    private BigDecimal balanceAfterTxn;

    // ✅ Constructor
    public TransactionStatementDTO(Long transactionId, String transactionDate, String transactionType,
                                   String paymentMethod, String remarks, BigDecimal amount,BigDecimal balanceAfterTxn) {
        this.transactionId = transactionId;
        this.transactionDate = transactionDate;
        this.transactionType = transactionType;
        this.paymentMethod = paymentMethod;
        this.remarks = remarks;
        this.amount = amount;
        this.balanceAfterTxn=balanceAfterTxn;
    }

    // ✅ Getters & Setters

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public BigDecimal getBalanceAfterTxn() {
        return balanceAfterTxn;
    }

    public void setBalanceAfterTxn(BigDecimal balanceAfterTxn) {
        this.balanceAfterTxn = balanceAfterTxn;
    }

}
