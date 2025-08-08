package com.oracle.bank.service;

import com.oracle.bank.model.Customer;
import com.oracle.bank.repository.CustomerRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) throws EntityNotFoundException {
        return customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with ID: " + id));
    }

    public Customer updateField(Long id, String fieldName, String value) throws EntityNotFoundException {
        Customer customer = getCustomerById(id);

        switch (fieldName) {
            case "firstName": customer.setFirstName(value); break;
            case "lastName": customer.setLastName(value); break;
            case "mobileNo": customer.setMobileNo(value); break;
            case "email": customer.setEmail(value); break;
            case "aadharNo": customer.setAadharNo(value); break;
            case "panNo": customer.setPanNo(value); break;
            case "dob":
                LocalDate localDate = LocalDate.parse(value);
                Date dob = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                customer.setDob(dob);
                break;
            case "residentialAddress": customer.setResidentialAddress(value); break;
            case "permanentAddress": customer.setPermanentAddress(value); break;
            case "occupation": customer.setOccupation(value); break;
            case "annualIncome": customer.setAnnualIncome(Double.parseDouble(value)); break;
            default: throw new IllegalArgumentException("Invalid field name: " + fieldName);
        }

        return customerRepository.save(customer);
    }


    public void deleteCustomer(Long id) throws EntityNotFoundException {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
    
    public Map<String, Object> loginCustomer(Long custId, String custPass) {
        Map<String, Object> response = new HashMap<>();
        Optional<Customer> customerOpt = customerRepository.findById(custId);

        if (customerOpt.isEmpty()) {
            response.put("login", false);
            response.put("details", "Invalid CustID");
            return response;
        }

        Customer customer = customerOpt.get();
        if (!customer.getLoginPassword().equals(custPass)) {
            response.put("login", false);
            response.put("details", "Incorrect Password");
            return response;
        }

        response.put("login", true);
        response.put("details", "Login Successful");
        return response;
    }
    
    public String getEmailIdByCustomerId(Long customerId) {
        return customerRepository.findById(customerId)
                .map(Customer::getEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + customerId));
    }

}
