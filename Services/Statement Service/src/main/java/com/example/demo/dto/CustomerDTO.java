package com.example.demo.dto;

import java.util.Date;

public class CustomerDTO {

    private Long customerID;
    private String title;
    private String firstName;
    private String middleName;
    private String lastName;
    private String mobileNo;
    private String email;
    private String aadharNo;
    private String panNo;
    private Date dob;
    private String residentialAddress;
    private String permanentAddress;
    private String occupation;
    private Double annualIncome;

    public CustomerDTO() {}

    public CustomerDTO(Long customerID, String title, String firstName, String middleName, String lastName,
                       String mobileNo, String email, String aadharNo, String panNo, Date dob,
                       String residentialAddress, String permanentAddress, String occupation,
                       Double annualIncome) {
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
    }

    // Getters and setters

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
}
