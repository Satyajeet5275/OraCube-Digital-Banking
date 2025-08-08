package com.oracle.bank.controller;

import com.oracle.bank.model.Account;
import com.oracle.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // ✅ Get all accounts
    @GetMapping("/getAll")
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    // ✅ Get account by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }
    
    // ✅ Add a new account
    @PostMapping("/create")
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        Account createdAccount = accountService.createAccount(account);
        return ResponseEntity.ok(createdAccount);
    }


    // ✅ Delete account by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok("Account deleted successfully");
    }


    // ✅ Patch update for specific field
    @PatchMapping("/updateField/{id}")
    public ResponseEntity<Account> updateField(
            @PathVariable Long id,
            @RequestBody Map<String, String> updateRequest) {

        String fieldName = updateRequest.get("fieldName");
        String value = updateRequest.get("value");

        return ResponseEntity.ok(accountService.updateField(id, fieldName, value));
    }


}
