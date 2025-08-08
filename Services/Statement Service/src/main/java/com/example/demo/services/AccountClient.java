package com.example.demo.services;

import com.example.demo.dto.AccountBalanceDTO;
import com.example.demo.dto.AccountDTO;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "account-service", url = "http://localhost:8081") // use actual service base URL
public interface AccountClient {

    @GetMapping("/account/get/{accountNo}") // ✅ Corrected to match AccountController
    AccountDTO getAccountById(@PathVariable("accountNo") Long accountNo);

    @GetMapping("/account/get/{accountNo}/balance") // ✅ This should exist in your controller
    AccountBalanceDTO getAccountBalance(@PathVariable("accountNo") Long accountNo);
}
