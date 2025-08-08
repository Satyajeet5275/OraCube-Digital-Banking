package com.oracle.bank.controller;

import com.oracle.bank.model.Customer;
import com.oracle.bank.service.CustomerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/create")
    public ResponseEntity<Customer> create(@RequestBody Customer customer) {
        Customer created = customerService.createCustomer(customer);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Customer>> getAll() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Customer> getById(@PathVariable Long id) throws EntityNotFoundException {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PatchMapping("/updateField/{id}")
    public ResponseEntity<Customer> updateField(
            @PathVariable Long id,
            @RequestBody Map<String, String> updateRequest) throws EntityNotFoundException {
        
        String fieldName = updateRequest.get("fieldName");
        String value = updateRequest.get("value");
        
        return ResponseEntity.ok(customerService.updateField(id, fieldName, value));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws EntityNotFoundException {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
    
    // ✅ Login Customer
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginCustomer(@RequestBody Map<String, String> loginRequest) {
        Long custId = Long.parseLong(loginRequest.get("custId"));
        String custPass = loginRequest.get("custPass");

        Map<String, Object> response = customerService.loginCustomer(custId, custPass);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/getEmail/{customerId}")
    public ResponseEntity<String> getEmailIdByCustomerId(@PathVariable Long customerId) {
        String email = customerService.getEmailIdByCustomerId(customerId);
        return ResponseEntity.ok(email);
    }
    
}
