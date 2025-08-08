package com.example.demo.service;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.dto.CustomerDTO;

import java.util.List;

@FeignClient(name = "customer-service", url = "http://localhost:8081/customer")
public interface CustomerClient {

    @GetMapping("/getAll")
    List<CustomerDTO> getAllCustomers();

    @GetMapping("/get/{id}")
    CustomerDTO getCustomerById(@PathVariable("id") Long id);

    @PostMapping("/create")
    CustomerDTO createCustomer(@RequestBody CustomerDTO customerDTO);
}