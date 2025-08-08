package com.oracle.bank.service;

import com.oracle.bank.model.Account;
import com.oracle.bank.repository.AccountRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public Account createAccount(Account account) {
    	account.setApplicationDate(new Date());
        return accountRepository.save(account);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccountById(Long accountNo) throws EntityNotFoundException {
        return accountRepository.findById(accountNo)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with Account No: " + accountNo));
    }

    public Account updateField(Long accountNo, String fieldName, String value) throws EntityNotFoundException {
        Account account = getAccountById(accountNo);

        switch (fieldName) {
            case "accountType" -> account.setAccountType(value);
            case "status" -> account.setStatus(value);
            case "transactionPassword" -> account.setTransactionPassword(value);
            // case "balance" -> account.setBalance(Double.valueOf(value)); // optional
            default -> throw new IllegalArgumentException("Invalid field name: " + fieldName);
        }

        return accountRepository.save(account);
    }

    public void deleteAccount(Long accountNo) throws EntityNotFoundException {
        Account account = getAccountById(accountNo);
        accountRepository.delete(account);
    }
}
