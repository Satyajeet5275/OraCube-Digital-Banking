package com.example.demo.service;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.dto.AccountDTO;

import java.util.List;



@FeignClient(name = "account-service", url = "http://localhost:8081/account")  // controller base path
public interface AccountClient {

    @GetMapping("/getAll")
    List<AccountDTO> getAllAccounts();

    @GetMapping("/get/{id}")
    AccountDTO getAccountById(@PathVariable("id") Long id);

    @PostMapping("/create")  // ✅ Matches FeignClient
    AccountDTO createAccount(@RequestBody AccountDTO accountDTO);
}