package com.example.demo.controller;

import com.example.demo.dto.AccountSummaryDTO;
import com.example.demo.services.AccountSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountSummaryController {

    @Autowired
    private AccountSummaryService accountSummaryService;

    @GetMapping("/summary/{customerId}/{accountNo}")
    public ResponseEntity<AccountSummaryDTO> getAccountSummary(
            @PathVariable Long customerId,
            @PathVariable Long accountNo) {
        return ResponseEntity.ok(accountSummaryService.getAccountSummary(customerId, accountNo));
    }
}
