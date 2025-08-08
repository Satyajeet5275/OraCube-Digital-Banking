package com.example.demo.services;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service", url = "http://localhost:8081/customer")  // change port if needed
public interface CustomerClient {

    @GetMapping("/getEmail/{customerId}")
    String getCustomerEmail(@PathVariable("customerId") Long customerId);
    
    
    @GetMapping("/customer/getFullName/{customerId}")
    String getCustomerFullName(@PathVariable Long customerId);
}
