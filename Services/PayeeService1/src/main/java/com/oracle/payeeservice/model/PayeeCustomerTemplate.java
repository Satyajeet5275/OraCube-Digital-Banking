package com.oracle.payeeservice.model;

import com.oracle.payeeservice.dto.*;
import com.oracle.payeeservice.entities.Payee;

public class PayeeCustomerTemplate {

    private Payee payee;
    private CustomerDTO customer; // ✅ Use DTO instead of entity

    public Payee getPayee() {
        return payee;
    }

    public void setPayee(Payee payee) {
        this.payee = payee;
    }

    public CustomerDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDTO customer) {
        this.customer = customer;
    }
}
