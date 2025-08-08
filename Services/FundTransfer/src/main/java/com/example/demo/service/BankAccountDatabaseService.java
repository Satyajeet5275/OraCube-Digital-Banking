//package com.example.demo.service;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import com.example.exception.AccountNotFoundException;
//import com.example.demo.entities.BankAccount;
//import com.example.demo.repo.AccountDatabaseRepository;
//import org.springframework.stereotype.Service; // ✅ Add this import
//
//@Service // ✅ Add this annotation
//public class BankAccountDatabaseService {
//	@Autowired
//	
//	AccountDatabaseRepository accountRepository;
//	
//	public List<BankAccount> fetchAllAccounts(){
//		return accountRepository.findAll();
//	}
//	
//
//
//	
//	
//public BankAccount fetchAccountById(int id) {
//	
//    return accountRepository.findById(id)
//        .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + id));
//}
//
//
//
//
//}
