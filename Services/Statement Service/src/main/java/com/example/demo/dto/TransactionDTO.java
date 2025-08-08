package com.example.demo.dto;

import java.time.LocalDateTime;

import com.example.demo.enums.*;


public class TransactionDTO {

    private Long transactionId;
    private Long senderAccountNo;
    private Long receiverAccountNo;
  
    private PaymentMethod paymentMethod;
    private double amount;
    
    private TransactionType transactionType;
    private TransactionStatus status;
   
    private String remarks;
    private LocalDateTime transactionDate;
    private LocalDateTime entryTimestamp;
    private double balanceAfterTxn;
    private Long payeeId;

    // Getters and Setters

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public Long getSenderAccountNo() {
        return senderAccountNo;
    }

    public void setSenderAccountNo(Long senderAccountNo) {
        this.senderAccountNo = senderAccountNo;
    }

    public Long getReceiverAccountNo() {
        return receiverAccountNo;
    }

    public void setReceiverAccountNo(Long receiverAccountNo) {
        this.receiverAccountNo = receiverAccountNo;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public LocalDateTime getEntryTimestamp() {
        return entryTimestamp;
    }

    public void setEntryTimestamp(LocalDateTime entryTimestamp) {
        this.entryTimestamp = entryTimestamp;
    }

    public double getBalanceAfterTxn() {
        return balanceAfterTxn;
    }

    public void setBalanceAfterTxn(double balanceAfterTxn) {
        this.balanceAfterTxn = balanceAfterTxn;
    }

    public Long getPayeeId() {
        return payeeId;
    }

    public void setPayeeId(Long payeeId) {
        this.payeeId = payeeId;
    }
}
