package com.oracle.bank.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "account")
public class Account {

    @Id
    @SequenceGenerator(name = "account_no_seq", sequenceName = "ACCOUNT_NO_SEQ", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_no_seq")
    @Column(name = "account_no", unique = true, nullable = false)
    private Long accountNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 30)
    private AccountType accountType;

    @Temporal(TemporalType.DATE)
    @Column(name = "application_date", nullable = false)
    private Date applicationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AccountStatus status;

    @Column(nullable = false)
    private Double balance = 0.0;

    @Column(name = "transaction_password", nullable = false, length = 100)
    private String transactionPassword;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "customerID", referencedColumnName = "customerID", nullable = false,
                foreignKey = @ForeignKey(name = "fk_customer_account"))
    private Customer customer;

    // --- Constructors ---
    public Account() {}

    public Account(AccountType accountType, Date applicationDate, AccountStatus status,
                   Double balance, String transactionPassword, Customer customer) {
        this.accountType = accountType;
        this.applicationDate = applicationDate;
        this.status = status;
        this.balance = balance;
        this.transactionPassword = transactionPassword;
        this.customer = customer;
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

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}
