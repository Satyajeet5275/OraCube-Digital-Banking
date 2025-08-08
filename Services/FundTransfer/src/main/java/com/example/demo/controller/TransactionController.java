package com.example.demo.controller;

import com.example.demo.dto.PayeeDTO;
import com.example.demo.dto.TransactionRequest;
import com.example.demo.entities.Transactions;
import com.example.demo.service.PayeeClient;
import com.example.demo.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TransactionController {

    private final TransactionService transactionService;
    private final PayeeClient payeeClient; // ✅ Feign client injected

    public TransactionController(TransactionService transactionService, PayeeClient payeeClient) {
        this.transactionService = transactionService;
        this.payeeClient = payeeClient;
    }

    // ✅ Fetch saved payees from another microservice via Feign
    @GetMapping("/{customerId}/{senderaccountNumber}/payees")
    public ResponseEntity<?> getPayeesByCustomerAndAccount(
            @PathVariable Long customerId,
            @PathVariable Long senderaccountNumber) {
        try {
            List<PayeeDTO> payees = payeeClient.getPayeesByCustomerAndAccount(customerId, senderaccountNumber);
            return ResponseEntity.ok(payees);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Error fetching payees: " + e.getMessage());
        }
    }

    // ✅ Self-deposit endpoint
    @PostMapping("/{customerId}/{accountNumber}/self-deposit")
    public ResponseEntity<?> selfDeposit(
            @PathVariable Long customerId,
            @PathVariable Long accountNumber,
            @RequestBody TransactionRequest request) {
        try {
            request.setCustomerId(customerId);
            request.setAccountNumber(accountNumber);

            Transactions txn = transactionService.performSelfDeposit(request);
            return ResponseEntity.ok(txn);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Deposit failed: " + e.getMessage());
        }
    }

    // ✅ Payee Transfer using Feign to validate payee ID if needed
    @PostMapping("/{customerId}/{accountNumber}/payee-transfer/{payee_id}")
    public ResponseEntity<?> payeeTransfer(
            @PathVariable Long customerId,
            @PathVariable Long accountNumber,
            @PathVariable("payee_id") Long payeeId,
            @RequestBody TransactionRequest request) {
        try {
            request.setCustomerId(customerId);
            request.setAccountNumber(accountNumber);
            request.setPayeeId(payeeId);

            // Optional: validate payee exists
            PayeeDTO payee = payeeClient.getPayeeById(payeeId);

            Transactions txn = transactionService.performPayeeTransfer(request);
            return ResponseEntity.ok(txn);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Payee transfer failed: " + e.getMessage());
        }
    }

    // ✅ Get all transactions by account number
    @GetMapping("/transactions/account/{accountNo}")
    public ResponseEntity<List<Transactions>> getTransactionsByAccount(@PathVariable Long accountNo) {
        List<Transactions> transactions = transactionService.getTransactionsByAccount(accountNo);
        return ResponseEntity.ok(transactions);
    }
}
