package com.example.demo.services;

import com.example.demo.dto.TransactionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "transaction-service", url = "http://localhost:8087")
public interface TransactionClient {

    // 🔁 CHANGED: Removed /api
    @GetMapping("/api/transactions/account/{accountNo}")
    List<TransactionDTO> getTransactionsByAccount(@PathVariable("accountNo") Long accountNo);
}
