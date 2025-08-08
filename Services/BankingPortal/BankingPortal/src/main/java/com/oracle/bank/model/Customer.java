package com.oracle.bank.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Customer {

	@Id
	@SequenceGenerator(
	    name = "customer_seq",
	    sequenceName = "CUSTOMER_SEQ", // must match Oracle sequence if using manual sequence
	    initialValue = 1000000000,
	    allocationSize = 1
	)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customer_seq")
	private Long customerID;

    @Column(nullable = false, length = 5)
    private String title;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(length = 50)
    private String middleName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 10)
    private String mobileNo;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, unique = true, length = 12)
    private String aadharNo;

    @Column(nullable = false, unique = true, length = 10)
    private String panNo;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date dob;

    @Column(nullable = false, length = 255)
    private String residentialAddress;

    @Column(nullable = false, length = 255)
    private String permanentAddress;

    @Column(nullable = false, length = 10)
    private String occupation;

    @Column
    private Double annualIncome;

    @Column(nullable = false, length = 100)
    private String loginPassword;

    public Customer() {}

    public Customer(Long customerID, String title, String firstName, String middleName, String lastName,
                    String mobileNo, String email, String aadharNo, String panNo, Date dob,
                    String residentialAddress, String permanentAddress, String occupation,
                    Double annualIncome, String loginPassword) {
        this.customerID = customerID;
        this.title = title;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.mobileNo = mobileNo;
        this.email = email;
        this.aadharNo = aadharNo;
        this.panNo = panNo;
        this.dob = dob;
        this.residentialAddress = residentialAddress;
        this.permanentAddress = permanentAddress;
        this.occupation = occupation;
        this.annualIncome = annualIncome;
        this.loginPassword = loginPassword;
    }

    
	public Long getCustomerID() {
		return customerID;
	}

	public void setCustomerID(Long customerID) {
		this.customerID = customerID;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAadharNo() {
		return aadharNo;
	}

	public void setAadharNo(String aadharNo) {
		this.aadharNo = aadharNo;
	}

	public String getPanNo() {
		return panNo;
	}

	public void setPanNo(String panNo) {
		this.panNo = panNo;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	public String getResidentialAddress() {
		return residentialAddress;
	}

	public void setResidentialAddress(String residentialAddress) {
		this.residentialAddress = residentialAddress;
	}

	public String getPermanentAddress() {
		return permanentAddress;
	}

	public void setPermanentAddress(String permanentAddress) {
		this.permanentAddress = permanentAddress;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	public Double getAnnualIncome() {
		return annualIncome;
	}

	public void setAnnualIncome(Double annualIncome) {
		this.annualIncome = annualIncome;
	}

	public String getLoginPassword() {
		return loginPassword;
	}

	public void setLoginPassword(String loginPassword) {
		this.loginPassword = loginPassword;
	}
}
