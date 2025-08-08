package com.oracle.payeeservice.service;
import com.oracle.payeeservice.dto.CustomerDTO; // ✅ Use DTO instead of missing entity

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service", url = "http://localhost:8081")  // change port if needed
public interface CustomerClient {

    @GetMapping("/customer/get/{customerId}")
    CustomerDTO getCustomerById(@PathVariable("customerId") Long customerId); // ✅ use DTO

    @GetMapping("/customer/getEmail/{customerId}")
    String getCustomerEmail(@PathVariable("customerId") Long customerId);
}

