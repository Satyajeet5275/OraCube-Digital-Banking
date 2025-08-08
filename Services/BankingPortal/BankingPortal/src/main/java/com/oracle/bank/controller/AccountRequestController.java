package com.oracle.bank.controller;

import com.oracle.bank.model.AccountRequest;
import com.oracle.bank.service.AccountRequestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountException;
import javax.security.auth.login.AccountNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/accountRequest")
public class AccountRequestController {

    @Autowired
    private AccountRequestService accountRequestService;

	@GetMapping("/home")
	public String home() {
		return "<h1>Hello! Welcome in Oracle Bank - Account Request Page :)<h1>";
	}
    
    // ➕ Create AccountRequest
    @PostMapping("/create")
    public ResponseEntity<AccountRequest> add(@RequestBody AccountRequest accountRequest) throws AccountException {
        AccountRequest saved = accountRequestService.addAccountRequest(accountRequest);
        return ResponseEntity.ok(saved);
    }

    // 📋 Get All AccountRequests
    @GetMapping("/getAll")
    public ResponseEntity<List<AccountRequest>> getAll() {
        List<AccountRequest> list = accountRequestService.getAllAccountRequests();
        return ResponseEntity.ok(list);
    }

    // 🔍 Get AccountRequest by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<AccountRequest> getById(@PathVariable Long id) throws AccountNotFoundException {
        AccountRequest found = accountRequestService.getAccountRequestById(id);
        return ResponseEntity.ok(found);
    }

    // 🔁 Update AccountRequest
    @PutMapping("/update/{id}")
    public ResponseEntity<AccountRequest> update(@PathVariable Long id, @RequestBody AccountRequest updatedRequest)
            throws AccountNotFoundException {
        AccountRequest updated = accountRequestService.updateAccountRequest(id, updatedRequest);
        return ResponseEntity.ok(updated);
    }

    // ❌ Delete AccountRequest
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws AccountNotFoundException {
        accountRequestService.deleteAccountRequest(id);
        return ResponseEntity.noContent().build();
    }
}
