package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.TransactionRequest;
import com.example.demo.entities.Transactions;

public interface TransactionService {
    Transactions performSelfDeposit(TransactionRequest request);
    
    Transactions performPayeeTransfer(TransactionRequest request);
    
    // ✅ Add this method
    List<Transactions> getTransactionsByAccount(Long accountNumber);
   
}
