package com.example.demo.service;

import com.example.demo.dto.AccountDTO;
import com.example.demo.dto.AccountStatus;
import com.example.demo.dto.AccountType;
import com.example.demo.dto.AdminDecisionDTO;
import com.example.demo.dto.CustomerDTO;
import com.example.demo.entities.AccountRequest;
import com.example.demo.repos.AccountRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
public class AccountRequestServiceImpl implements AccountRequestService {

    @Autowired
    private AccountRequestRepository requestRepo;

    @Autowired
    private CustomerClient customerClient;

    @Autowired
    private AccountClient accountClient;

    private static final String CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private String generateRandomPassword(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            password.append(CHAR_SET.charAt(random.nextInt(CHAR_SET.length())));
        }
        return password.toString();
    }

    @Override
    public List<AccountRequest> getAllRequests() {
        return requestRepo.findAll();
    }

    @Override
    public void processRequest(Long requestId, AdminDecisionDTO decision) {
        AccountRequest request = requestRepo.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

        String status = decision.getStatus().trim().toLowerCase();

        if (status.equals("approved")) {

            String loginPassword = generateRandomPassword(10);
            String txnPassword = generateRandomPassword(10);

            // Prepare CustomerDTO
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setTitle(request.getTitle());
            customerDTO.setFirstName(request.getFirstName());
            customerDTO.setMiddleName(request.getMiddleName());
            customerDTO.setLastName(request.getLastName());
            customerDTO.setMobileNo(request.getMobileNo());
            customerDTO.setEmail(request.getEmail());
            customerDTO.setAadharNo(request.getAadharNo());
            customerDTO.setPanNo(request.getPanNo());
            customerDTO.setDob(request.getDob());
            customerDTO.setResidentialAddress(request.getResidentialAddress());
            customerDTO.setPermanentAddress(request.getPermanentAddress());
            customerDTO.setOccupation(request.getOccupation());
            customerDTO.setAnnualIncome(request.getAnnualIncome());
            customerDTO.setLoginPassword(loginPassword);

            // ✅ Call Customer Service
            CustomerDTO createdCustomer = customerClient.createCustomer(customerDTO);

            // Prepare AccountDTO
            AccountDTO accountDTO = new AccountDTO();
            accountDTO.setAccountType(AccountType.valueOf(request.getAccountType().toUpperCase()));

            accountDTO.setApplicationDate(request.getApplicationDate());
            accountDTO.setStatus(AccountStatus.ACTIVE); // enum value
            accountDTO.setBalance(0.0);
            accountDTO.setTransactionPassword(txnPassword);
            accountDTO.setCustomerId(createdCustomer.getCustomerId());
            
            
            System.out.println("Sending AccountDTO: " + accountDTO);

            // ✅ Call Account Service
            accountClient.createAccount(accountDTO);

            // ✅ Remove the processed request
            requestRepo.deleteById(requestId);

        } else if (status.equals("rejected")) {
            requestRepo.deleteById(requestId);
        } else {
            throw new RuntimeException("Invalid status. Use 'Approved' or 'Rejected'.");
        }

        System.out.println("Admin Remark: " + decision.getRemark());
    }
}
