////package com.example.demo.entities;
////
////import jakarta.persistence.*;
////import java.math.BigDecimal;
////import java.time.LocalDateTime;
////
////@Entity
////@Table(name = "TRANSACTIONS")
////public class Transaction {
////
////    @Id
////    @GeneratedValue(strategy = GenerationType.IDENTITY)
////    @Column(name = "TRANSACTION_ID", nullable = false)
////    private Long transactionId;
////
////    @Column(name = "ACCOUNT_NUMBER", nullable = false)
////    private Long accountNumber;
////
////    @Column(name = "AMOUNT", nullable = false, precision = 12, scale = 2)
////    private BigDecimal amount;
////
////    @Enumerated(EnumType.STRING)
////    @Column(name = "TRANSACTION_TYPE", nullable = false, length = 10)
////    private TransactionType transactionType;
////
////    @Enumerated(EnumType.STRING)
////    @Column(name = "STATUS", nullable = false, length = 10)
////    private TransactionStatus status;
////
////    @Column(name = "REMARKS", length = 255)
////    private String remarks;
////
////    @Column(name = "TRANSACTION_DATE", nullable = false)
////    private LocalDateTime transactionDate;
////
////    // Default Constructor
////    public Transaction() {
////        this.transactionDate = LocalDateTime.now();
////        this.status = TransactionStatus.PENDING;
////    }
////
////    // Parameterized Constructor
////    public Transaction(Long accountNumber, BigDecimal amount, TransactionType transactionType, String remarks) {
////        this.accountNumber = accountNumber;
////        this.amount = amount;
////        this.transactionType = transactionType;
////        this.remarks = remarks;
////        this.transactionDate = LocalDateTime.now();
////        this.status = TransactionStatus.PENDING;
////    }
////
////    // Getters and Setters
////    public Long getTransactionId() {
////        return transactionId;
////    }
////
////    public void setTransactionId(Long transactionId) {
////        this.transactionId = transactionId;
////    }
////
////    public Long getAccountNumber() {
////        return accountNumber;
////    }
////
////    public void setAccountNumber(Long accountNumber) {
////        this.accountNumber = accountNumber;
////    }
////
////    public BigDecimal getAmount() {
////        return amount;
////    }
////
////    public void setAmount(BigDecimal amount) {
////        this.amount = amount;
////    }
////
////    public TransactionType getTransactionType() {
////        return transactionType;
////    }
////
////    public void setTransactionType(TransactionType transactionType) {
////        this.transactionType = transactionType;
////    }
////
////    public TransactionStatus getStatus() {
////        return status;
////    }
////
////    public void setStatus(TransactionStatus status) {
////        this.status = status;
////    }
////
////    public String getRemarks() {
////        return remarks;
////    }
////
////    public void setRemarks(String remarks) {
////        this.remarks = remarks;
////    }
////
////    public LocalDateTime getTransactionDate() {
////        return transactionDate;
////    }
////
////    public void setTransactionDate(LocalDateTime transactionDate) {
////        this.transactionDate = transactionDate;
////    }
////}
//
//
////
////package com.example.demo.entities;
////
////import jakarta.persistence.*;
////import java.math.BigDecimal;
////import java.time.LocalDateTime;
////
////
////@Entity
////@Table(name = "TRANSACTIONS")
////public class Transaction {
////
////    @Id
////    @GeneratedValue(strategy = GenerationType.IDENTITY)
////    @Column(name = "TRANSACTION_ID", nullable = false)
////    private Long transactionId;
////
////    @Column(name = "ACCOUNT_NUMBER", nullable = false)
////    private Long accountNumber;
////
////    @Column(name = "AMOUNT", nullable = false, precision = 12, scale = 2)
////    private BigDecimal amount;
////
////    @Enumerated(EnumType.STRING)
////    @Column(name = "TRANSACTION_TYPE", nullable = false, length = 10)
////    private TransactionType transactionType;
////
////    @Enumerated(EnumType.STRING)
////    @Column(name = "STATUS", nullable = false, length = 10)
////    private TransactionStatus status;
////
////    @Column(name = "REMARKS", length = 255)
////    private String remarks;
////
////    @Column(name = "TRANSACTION_DATE", nullable = false)
////    private LocalDateTime transactionDate;
////
////    @Enumerated(EnumType.STRING)
////    @Column(name = "TRANSACTION_METHOD", length = 20)
////    private PaymentMethod transactionMethod;
////
////    // NEW FIELD: PAYEE_ACCOUNT_NUMBER
////    @Column(name = "PAYEE_ACCOUNT_NUMBER")
////    private Long payeeAccountNumber;
////
////    // Default Constructor
////    public Transaction() {
////        this.transactionDate = LocalDateTime.now();
////        this.status = TransactionStatus.PENDING;
////    }
////
////    // Parameterized Constructor
////    public Transaction(Long accountNumber, Long payeeAccountNumber, BigDecimal amount, TransactionType transactionType, String remarks, PaymentMethod transactionMethod) {
////        this.accountNumber = accountNumber;
////        this.payeeAccountNumber = payeeAccountNumber;
////        this.amount = amount;
////        this.transactionType = transactionType;
////        this.remarks = remarks;
////        this.transactionMethod = transactionMethod;
////        this.transactionDate = LocalDateTime.now();
////        this.status = TransactionStatus.PENDING;
////    }
////
////    // Getters and Setters
////    public Long getTransactionId() {
////        return transactionId;
////    }
////
////    public void setTransactionId(Long transactionId) {
////        this.transactionId = transactionId;
////    }
////
////    public Long getAccountNumber() {
////        return accountNumber;
////    }
////
////    public void setAccountNumber(Long accountNumber) {
////        this.accountNumber = accountNumber;
////    }
////
////    public BigDecimal getAmount() {
////        return amount;
////    }
////
////    public void setAmount(BigDecimal amount) {
////        this.amount = amount;
////    }
////
////    public TransactionType getTransactionType() {
////        return transactionType;
////    }
////
////    public void setTransactionType(TransactionType transactionType) {
////        this.transactionType = transactionType;
////    }
////
////    public TransactionStatus getStatus() {
////        return status;
////    }
////
////    public void setStatus(TransactionStatus status) {
////        this.status = status;
////    }
////
////    public String getRemarks() {
////        return remarks;
////    }
////
////    public void setRemarks(String remarks) {
////        this.remarks = remarks;
////    }
////
////    public LocalDateTime getTransactionDate() {
////        return transactionDate;
////    }
////
////    public void setTransactionDate(LocalDateTime transactionDate) {
////        this.transactionDate = transactionDate;
////    }
////
////    public PaymentMethod getTransactionMethod() {
////        return transactionMethod;
////    }
////
////    public void setTransactionMethod(PaymentMethod transactionMethod) {
////        this.transactionMethod = transactionMethod;
////    }
////
////
////    public Long getPayeeAccountNumber() {
////        return payeeAccountNumber;
////    }
////
////    public void setPayeeAccountNumber(Long payeeAccountNumber) {
////        this.payeeAccountNumber = payeeAccountNumber;
////    }
////}
////
//
//
//package com.example.demo.entities;
//
//import java.time.LocalDateTime;
//
//import jakarta.persistence.*;
//
//@Entity(name = "Transactions")
//@Table(name = "TRANSACTIONS")
//public class Transactions {
//
//    @Id
//    @Column(name = "transaction_id")
//    private Long transactionId;
//
//    @Column(name = "sender_account_no")
//    private Long senderAccountNo;
//
//    @Column(name = "receiver_account_no")
//    private Long receiverAccountNo;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "transaction_type", nullable = false, length = 20)
//    private TransactionType transactionType;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "payment_method", nullable = false, length = 20)
//    private PaymentMethod paymentMethod;
//
//    @Column(name = "amount", nullable = false)
//    private double amount;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "status", nullable = false, length = 15)
//    private TransactionStatus status;
//
//    @Column(name = "remarks")
//    private String remarks;
//
//    @Column(name = "transaction_date")
//    private LocalDateTime transactionDate;
//
//    @Column(name = "entry_timestamp")
//    private LocalDateTime entryTimestamp;
//
//    @Column(name = "balance_after_txn")
//    private double balanceAfterTxn;
//
//    @Column(name = "payee_id")
//    private Long payeeId; // Link to Payee (no relationship applied as per instruction)
//
//    // === Getters & Setters ===
//
//    public Long getTransactionId() {
//        return transactionId;
//    }
//
//    public void setTransactionId(Long transactionId) {
//        this.transactionId = transactionId;
//    }
//
//    public Long getSenderAccountNo() {
//        return senderAccountNo;
//    }
//
//    public void setSenderAccountNo(Long senderAccountNo) {
//        this.senderAccountNo = senderAccountNo;
//    }
//
//    public Long getReceiverAccountNo() {
//        return receiverAccountNo;
//    }
//
//    public void setReceiverAccountNo(Long receiverAccountNo) {
//        this.receiverAccountNo = receiverAccountNo;
//    }
//
//    public TransactionType getTransactionType() {
//        return transactionType;
//    }
//
//    public void setTransactionType(TransactionType transactionType) {
//        this.transactionType = transactionType;
//    }
//
//    public PaymentMethod getPaymentMethod() {
//        return paymentMethod;
//    }
//
//    public void setPaymentMethod(PaymentMethod paymentMethod) {
//        this.paymentMethod = paymentMethod;
//    }
//
//    public double getAmount() {
//        return amount;
//    }
//
//    public void setAmount(double amount) {
//        this.amount = amount;
//    }
//
//    public TransactionStatus getStatus() {
//        return status;
//    }
//
//    public void setStatus(TransactionStatus status) {
//        this.status = status;
//    }
//
//    public String getRemarks() {
//        return remarks;
//    }
//
//    public void setRemarks(String remarks) {
//        this.remarks = remarks;
//    }
//
//    public LocalDateTime getTransactionDate() {
//        return transactionDate;
//    }
//
//    public void setTransactionDate(LocalDateTime transactionDate) {
//        this.transactionDate = transactionDate;
//    }
//
//    public LocalDateTime getEntryTimestamp() {
//        return entryTimestamp;
//    }
//
//    public void setEntryTimestamp(LocalDateTime entryTimestamp) {
//        this.entryTimestamp = entryTimestamp;
//    }
//
//    public double getBalanceAfterTxn() {
//        return balanceAfterTxn;
//    }
//
//    public void setBalanceAfterTxn(double balanceAfterTxn) {
//        this.balanceAfterTxn = balanceAfterTxn;
//    }
//
//    public Long getPayeeId() {
//        return payeeId;
//    }
//
//    public void setPayeeId(Long payeeId) {
//        this.payeeId = payeeId;
//    }
//}


package com.example.demo.entities;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity(name = "Transactions")
@Table(name = "TRANSACTIONS")
public class Transactions {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transaction_id_seq")
    @SequenceGenerator(name = "transaction_id_seq", sequenceName = "TRANSACTION_ID_SEQ", allocationSize = 1)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "sender_account_no")
    private Long senderAccountNo;

    @Column(name = "receiver_account_no")
    private Long receiverAccountNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    @Column(name = "amount", nullable = false)
    private double amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 15)
    private TransactionStatus status;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "transaction_date",nullable = true)
    private LocalDateTime transactionDate;

    @Column(name = "entry_timestamp")
    private LocalDateTime entryTimestamp;

    @Column(name = "balance_after_txn")
    private double balanceAfterTxn;

    @Column(name = "payee_id",nullable = true)
    private Long payeeId; // Link to Payee (manual FK if needed)

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
