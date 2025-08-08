package com.oracle.bank.service;

import com.oracle.bank.model.AccountRequest;
import com.oracle.bank.repository.AccountRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountException;
import javax.security.auth.login.AccountNotFoundException;
import java.util.List;

@Service
public class AccountRequestService {

    @Autowired
    private AccountRequestRepository accountRequestRepository;

    // ✅ Create
    public AccountRequest addAccountRequest(AccountRequest accountRequest) throws AccountException {
        if (accountRequest.getAccountRequestID() != null &&
            accountRequestRepository.existsById(accountRequest.getAccountRequestID())) {
            throw new AccountException("AccountRequest already exists with ID: " + accountRequest.getAccountRequestID());
        }
        return accountRequestRepository.save(accountRequest);
    }

    // ✅ Read all
    public List<AccountRequest> getAllAccountRequests() {
        return accountRequestRepository.findAll();
    }

    // ✅ Read single by ID
    public AccountRequest getAccountRequestById(Long id) throws AccountNotFoundException {
        return accountRequestRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("AccountRequest not found with ID: " + id));
    }

    // ✅ Read single by passing object
    public AccountRequest getAccountRequest(AccountRequest request) throws AccountNotFoundException {
        return getAccountRequestById(request.getAccountRequestID());
    }

    // ✅ Update
    public AccountRequest updateAccountRequest(Long id, AccountRequest updatedRequest) throws AccountNotFoundException {
        AccountRequest existing = accountRequestRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("AccountRequest not found with ID: " + id));

        updatedRequest.setAccountRequestID(id); // Ensure ID remains consistent
        return accountRequestRepository.save(updatedRequest);
    }

    // ✅ Delete
    public void deleteAccountRequest(Long id) throws AccountNotFoundException {
        if (!accountRequestRepository.existsById(id)) {
            throw new AccountNotFoundException("AccountRequest not found with ID: " + id);
        }
        accountRequestRepository.deleteById(id);
    }
}
