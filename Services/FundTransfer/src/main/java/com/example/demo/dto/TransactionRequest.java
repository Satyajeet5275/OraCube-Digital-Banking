package com.example.demo.dto;

import java.math.BigDecimal;

import com.example.demo.entities.PaymentMethod;
import com.example.demo.entities.TransactionType;

public class TransactionRequest {

    private Long customerId;
    private Long accountNumber;
    private BigDecimal amount;
    private PaymentMethod paymentMethod; // Example: SELF_DEPOSIT
    private String remarks;
    private String transactionPassword;  // 🔐 Add this
    
    
 // Add this for payee transfers
    private Long payeeId;

    // Getters and setters

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(Long accountNumber) {
        this.accountNumber = accountNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    
    public Long getPayeeId() {
        return payeeId;
    }

    public void setPayeeId(Long payeeId) {
        this.payeeId = payeeId;
    }
    

    public String getTransactionPassword() {
    	return transactionPassword;
    }

    public void setTransactionPassword(String transactionPassword) {
    	this.transactionPassword = transactionPassword;
    }
    
    
}
