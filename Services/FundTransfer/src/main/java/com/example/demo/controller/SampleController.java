//package com.example.demo.controller;
//
//import java.util.ArrayList;
//import java.util.Iterator;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.example.demo.entities.BankAccount;
//import com.example.demo.service.BankAccountDatabaseService;
//import com.example.exception.AccountNotFoundException;
//
//@RestController
//@RequestMapping("/bank")
//public class SampleController {
//
//
//	
//	
//	
//	@Autowired
//	BankAccountDatabaseService bankAccountDatabaseService;
//	
//	
//	
//    @GetMapping("/welcome")
//    public String welcome() {
//        return "Welcome to my bank";
//    }
//
//    @GetMapping("/accounts")
//    public List<BankAccount> fetchAllAccounts() {
//    	return bankAccountDatabaseService.fetchAllAccounts();
//    }
//    
//    @GetMapping("/accounts/{id}")
//    public ResponseEntity<?> getAccountById(@PathVariable int id) {
//        try {
//            BankAccount account = bankAccountDatabaseService.fetchAccountById(id);
//            return ResponseEntity.ok(account);
//        } catch (AccountNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
//        }
//    }
//
//    
//}
