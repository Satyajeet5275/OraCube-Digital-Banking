package com.example.demo.service;

import com.example.demo.dto.AccountDTO;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "banking-portal", url = "http://localhost:8081/account")
public interface AccountClient {

    @GetMapping("/get/{id}")
    AccountDTO getAccountById(@PathVariable("id") Long accountNo);

    @PutMapping("/updateField/{id}")
    void updateBalance(
        @PathVariable("id") Long accountNo,
        @RequestBody Map<String, String> updateRequest
    );
}