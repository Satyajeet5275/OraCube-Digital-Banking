package com.oracle.bank.controller;

import com.oracle.bank.dto.AccountDTO;
import com.oracle.bank.model.Account;
import com.oracle.bank.model.AccountStatus;
import com.oracle.bank.model.AccountType;
import com.oracle.bank.model.Customer;
import com.oracle.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/getAll")
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        List<AccountDTO> dtos = accounts.stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // ✅ Get account by ID and return as DTO
    @GetMapping("/get/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable Long id) {
        try {
            Account account = accountService.getAccountById(id);
            AccountDTO dto = convertToDTO(account);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO dto) {
        try {
            Account account = new Account();
            account.setAccountType(dto.getAccountType());
            account.setBalance(dto.getBalance());
            account.setTransactionPassword(dto.getTransactionPassword());
            account.setStatus(dto.getStatus());
            account.setApplicationDate(dto.getApplicationDate()); // ✅ add this

            Customer customer = new Customer();
            customer.setCustomerId(dto.getCustomerId());
            account.setCustomer(customer);

            Account created = accountService.createAccount(account);
            AccountDTO createdDTO = convertToDTO(created);
            return ResponseEntity.ok(createdDTO);
        } catch (Exception e) {
            e.printStackTrace();  // 🔥 Log the real reason
            return ResponseEntity.badRequest().body(null);
        }
    }


    // ✅ Update any field
    @PutMapping("/updateField/{id}")
    public ResponseEntity<AccountDTO> updateField(
            @PathVariable Long id,
            @RequestBody Map<String, String> updateRequest) {
        try {
            String fieldName = updateRequest.get("fieldName");
            String value = updateRequest.get("value");
            Account updated = accountService.updateField(id, fieldName, value);
            AccountDTO dto = convertToDTO(updated);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ✅ Delete by account number
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Get account by customer ID
    @GetMapping("/getCustomer/{customerId}")
    public ResponseEntity<AccountDTO> getAccountByCustomerId(@PathVariable Long customerId) {
        try {
            Account account = accountService.getAccountByCustomerId(customerId);
            AccountDTO dto = convertToDTO(account);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Helper method to convert Entity to DTO
    private AccountDTO convertToDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setAccountNo(account.getAccountNo());
        dto.setAccountType(AccountType.valueOf(account.getAccountType().toString()));
        dto.setApplicationDate(account.getApplicationDate());
        dto.setStatus(account.getStatus());
        dto.setBalance(account.getBalance());
        dto.setTransactionPassword(account.getTransactionPassword());
        dto.setCustomerId(account.getCustomer().getCustomerId());
        return dto;
    }
}
