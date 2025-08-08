package com.example.demo.services;


import com.example.demo.services.*;
import com.example.demo.dto.AccountBalanceDTO;
import com.example.demo.dto.AccountSummaryDTO;
import com.example.demo.dto.MailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountSummaryServiceImpl implements AccountSummaryService {

    @Autowired
    private AccountClient accountClient;

    @Autowired
    private CustomerClient customerClient;

    @Autowired
    private MailClient mailClient;

    @Override
    public AccountSummaryDTO getAccountSummary(Long customerId, Long accountNo) {
        // 1. Fetch account balance from Account Service
        AccountBalanceDTO balanceDTO = accountClient.getAccountBalance(accountNo);

        // 2. Fetch customer name and email using Customer Service
        String fullName = customerClient.getCustomerFullName(customerId); // e.g., "Ayush Gursal"
        String email = customerClient.getCustomerEmail(customerId);       // e.g., "ayush@email.com"

        // 3. Send email using Mail Service
        MailRequest mail = new MailRequest();
        mail.setEmailID(email);
        mail.setSubject("Balance Summary");
        mail.setMsg("Hi " + fullName + ",\n\nYour account balance is: " + balanceDTO.getAvailableBalance());
        mailClient.sendMail(mail);

        // 4. Return combined AccountSummaryDTO
        return new AccountSummaryDTO(
                accountNo,
                fullName,
                balanceDTO.getAvailableBalance(),
                balanceDTO.getEffectiveBalance()
        );
    }
}
