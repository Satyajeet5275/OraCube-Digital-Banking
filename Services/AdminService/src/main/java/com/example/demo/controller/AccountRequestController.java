package com.example.demo.controller;

import com.example.demo.dto.AdminDecisionDTO;
import com.example.demo.entities.AccountRequest;
import com.example.demo.service.AccountRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/account-requests")
public class AccountRequestController {

    @Autowired
    private AccountRequestService requestService;

    @GetMapping
    public List<AccountRequest> viewAllAccountRequests() {
        return requestService.getAllRequests();
    }
    
    @PostMapping("/process/{id}")
    public ResponseEntity<String> processRequest(@PathVariable Long id,
                                                 @RequestBody AdminDecisionDTO decision) {
        try {
            requestService.processRequest(id, decision);
            return ResponseEntity.ok("Request processed with status: " + decision.getStatus());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}


