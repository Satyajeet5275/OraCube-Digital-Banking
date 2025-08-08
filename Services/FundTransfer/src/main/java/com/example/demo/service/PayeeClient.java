package com.example.demo.service;

import com.example.demo.dto.PayeeDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "PayeeService", url = "http://localhost:8084") // Update with actual PayeeService base URL/port
public interface PayeeClient {

    @GetMapping("/{customerId}/{senderaccountNumber}/payees")
    List<PayeeDTO> getPayeesByCustomerAndAccount(
        @PathVariable("customerId") Long customerId,
        @PathVariable("senderaccountNumber") Long senderaccountNumber
    );
    
    
 // ✅ New method: Fetch payee by ID
    @GetMapping("/api/payees/{id}")
    PayeeDTO getPayeeById(@PathVariable("id") Long id);
}
