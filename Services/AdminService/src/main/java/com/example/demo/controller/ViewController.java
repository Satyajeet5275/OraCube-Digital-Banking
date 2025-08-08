package com.example.demo.controller;

import com.example.demo.dto.AccountDTO;
import com.example.demo.dto.CustomerDTO;
import com.example.demo.service.AccountClient;
import com.example.demo.service.CustomerClient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/view")
public class ViewController {

    @Autowired
    private CustomerClient customerClient;

    @Autowired
    private AccountClient accountClient;

    // ✅ Get all customers (DTOs)
    @GetMapping("/customers")
    public List<CustomerDTO> getAllCustomers() {
        return customerClient.getAllCustomers();
    }

    // ✅ Get customer by ID (DTO)
    @GetMapping("/customers/{id}")
    public CustomerDTO getCustomerById(@PathVariable Long id) {
        return customerClient.getCustomerById(id);
    }

    // ✅ Get all accounts (DTOs)
    @GetMapping("/accounts")
    public List<AccountDTO> getAllAccounts() {
        return accountClient.getAllAccounts();
    }

    // ✅ Get account by ID (DTO)
    @GetMapping("/accounts/{id}")
    public AccountDTO getAccountById(@PathVariable Long id) {
        return accountClient.getAccountById(id);
    }
}
