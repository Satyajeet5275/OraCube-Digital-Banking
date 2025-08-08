package com.oracle.bank.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Account {

	@Id
	@SequenceGenerator(name = "account_no_seq", sequenceName = "ACCOUNT_NO_SEQ", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_no_seq")
	@Column(name = "account_no", unique = true, nullable = false)
	private Long accountNo;



    @Column(nullable = false, length = 10)
    private String accountType;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date applicationDate;

    @Column(nullable = false, length = 10)
    private String status;

    @Column
    private Double balance = 0.0;

    @Column(nullable = false, length = 100)
    private String transactionPassword;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customerID", referencedColumnName = "customerID", foreignKey = @ForeignKey(name = "fk_customer_account"))
    private Customer customer;
    
    public Account() {}

    public Account(Long accountNo, String accountType, Date applicationDate, String status, Double balance, String transactionPassword, Customer customer) {
        this.accountNo = accountNo;
        this.accountType = accountType;
        this.applicationDate = applicationDate;
        this.status = status;
        this.balance = balance;
        this.transactionPassword = transactionPassword;
        this.customer = customer;
    }


	public Long getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(Long accountNo) {
		this.accountNo = accountNo;
	}

	public String getAccountType() {
		return accountType;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	public Date getApplicationDate() {
		return applicationDate;
	}

	public void setApplicationDate(Date applicationDate) {
		this.applicationDate = applicationDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
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
