package com.example.demo.service;

import com.example.demo.dto.AccountDTO;
import com.example.demo.dto.MailRequest;
import com.example.demo.dto.PayeeDTO;
import com.example.demo.dto.TransactionRequest;
import com.example.demo.entities.*;
import com.example.demo.repo.TransactionRepository;
import com.example.exception.TransactionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;




@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionsRepository;
    private final AccountClient accountClient;
    private final PayeeClient payeeClient;
    private MailClient mailClient;
    private CustomerClient customerClient;

    public TransactionServiceImpl(TransactionRepository transactionsRepository,
            AccountClient accountClient,
            PayeeClient payeeClient,
            MailClient mailClient,
            CustomerClient customerClient) {
        this.transactionsRepository = transactionsRepository;
        this.accountClient = accountClient;
        this.payeeClient = payeeClient;
        this.mailClient = mailClient;
        this.customerClient = customerClient;
    }

    @Override
    public Transactions performSelfDeposit(TransactionRequest request) {
        AccountDTO account = accountClient.getAccountById(request.getAccountNumber());

        double oldBalance = account.getBalance();
        double newBalance = oldBalance + request.getAmount().doubleValue();

        accountClient.updateBalance(
            request.getAccountNumber(),
            buildBalanceUpdateRequest(newBalance)
        );

        Transactions txn = new Transactions();
        txn.setSenderAccountNo(request.getAccountNumber());
        txn.setReceiverAccountNo(request.getAccountNumber());
        txn.setTransactionType(TransactionType.CREDIT);
        txn.setPaymentMethod(request.getPaymentMethod());
        txn.setAmount(request.getAmount().doubleValue());
        txn.setStatus(TransactionStatus.COMPLETED);
        txn.setRemarks(request.getRemarks());
        txn.setTransactionDate(LocalDateTime.now());
        txn.setEntryTimestamp(LocalDateTime.now());
        txn.setBalanceAfterTxn(newBalance);

        Transactions savedTxn = transactionsRepository.save(txn);

        Long customerId = account.getCustomerId();
        String email = customerClient.getCustomerEmail(customerId);

        MailRequest mail = new MailRequest();
        mail.setEmailID(email);
        mail.setSubject("Deposit Successful");
        mail.setMsg("₹" + request.getAmount() + " has been successfully deposited into your account ending with " 
                    + String.valueOf(request.getAccountNumber()).substring(String.valueOf(request.getAccountNumber()).length() - 4) + 
                    ".\nNew Balance: ₹" + newBalance);

        mailClient.sendMail(mail);

        return savedTxn;
    }

    @Override
    public Transactions performPayeeTransfer(TransactionRequest request) {
        AccountDTO senderAccount = accountClient.getAccountById(request.getAccountNumber());
        validateTransactionPassword(senderAccount, request.getTransactionPassword());

        BigDecimal amount = request.getAmount();

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new TransactionException("Amount must be greater than zero.");
        }

        if (senderAccount.getBalance() < amount.doubleValue()) {
            throw new TransactionException("Insufficient funds in sender's account.");
        }

        PaymentMethod method = request.getPaymentMethod();
        if (method == PaymentMethod.RTGS && amount.compareTo(new BigDecimal("200000")) < 0) {
            throw new TransactionException("RTGS requires minimum ₹2,00,000 transaction amount.");
        }

        PayeeDTO payee = payeeClient.getPayeeById(request.getPayeeId());
        if (payee == null) {
            throw new TransactionException("Payee not found from Payee Service.");
        }

        Long payeeAccountNumber = payee.getPayeeAccountNumber();
        AccountDTO payeeAccount = accountClient.getAccountById(payeeAccountNumber);

        LocalDateTime now = LocalDateTime.now();

        Transactions debitTxn = new Transactions();
        Transactions creditTxn = new Transactions();

        debitTxn.setSenderAccountNo(senderAccount.getAccountNo());
        debitTxn.setReceiverAccountNo(payeeAccount.getAccountNo());
        debitTxn.setAmount(amount.doubleValue());
        debitTxn.setTransactionType(TransactionType.DEBIT);
        debitTxn.setPaymentMethod(method);
        debitTxn.setTransactionDate(now);
        debitTxn.setRemarks(request.getRemarks());
        debitTxn.setEntryTimestamp(now);
        debitTxn.setPayeeId(payee.getPayeeId());

        creditTxn.setSenderAccountNo(senderAccount.getAccountNo());
        creditTxn.setReceiverAccountNo(payeeAccount.getAccountNo());
        creditTxn.setAmount(amount.doubleValue());
        creditTxn.setTransactionType(TransactionType.CREDIT);
        creditTxn.setPaymentMethod(method);
        creditTxn.setRemarks(request.getRemarks());
        creditTxn.setEntryTimestamp(now);
        creditTxn.setPayeeId(payee.getPayeeId());

        double senderNewBalance;
        double payeeNewBalance;

        switch (method) {
            case RTGS:
            case IMPS:
                creditTxn.setTransactionDate(now);

                senderNewBalance = senderAccount.getBalance() - amount.doubleValue();
                payeeNewBalance = payeeAccount.getBalance() + amount.doubleValue();

                accountClient.updateBalance(senderAccount.getAccountNo(), buildBalanceUpdateRequest(senderNewBalance));
                accountClient.updateBalance(payeeAccount.getAccountNo(), buildBalanceUpdateRequest(payeeNewBalance));

                debitTxn.setStatus(TransactionStatus.COMPLETED);
                debitTxn.setBalanceAfterTxn(senderNewBalance);

                creditTxn.setStatus(TransactionStatus.COMPLETED);
                creditTxn.setBalanceAfterTxn(payeeNewBalance);
                break;

            case NEFT:
                senderNewBalance = senderAccount.getBalance() - amount.doubleValue();
                payeeNewBalance = payeeAccount.getBalance(); // FIX: initialize payeeNewBalance
                accountClient.updateBalance(senderAccount.getAccountNo(), buildBalanceUpdateRequest(senderNewBalance));

                debitTxn.setStatus(TransactionStatus.COMPLETED);
                debitTxn.setBalanceAfterTxn(senderNewBalance);

                creditTxn.setStatus(TransactionStatus.PENDING);
                creditTxn.setBalanceAfterTxn(payeeAccount.getBalance());
                break;

            default:
                throw new TransactionException("Unsupported payment method.");
        }

        transactionsRepository.save(creditTxn);
        Transactions savedTxn = transactionsRepository.save(debitTxn);

        // Send mail to sender
        try {
            Long customerId = senderAccount.getCustomerId();
            String email = customerClient.getCustomerEmail(customerId);

            MailRequest mail = new MailRequest();
            mail.setEmailID(email);
            mail.setSubject("Transfer Successful");
            mail.setMsg("₹" + amount + " has been successfully transferred to account ending with " +
                    String.valueOf(payeeAccount.getAccountNo()).substring(String.valueOf(payeeAccount.getAccountNo()).length() - 4) +
                    ".\nNew Balance: ₹" + senderNewBalance);

            mailClient.sendMail(mail);
        } catch (Exception e) {
            System.out.println("Email send to sender failed: " + e.getMessage());
        }

        // Send mail to receiver (payee)
        try {
            Long receiverCustomerId = payeeAccount.getCustomerId();
            String receiverEmail = customerClient.getCustomerEmail(receiverCustomerId);

            MailRequest receiverMail = new MailRequest();
            receiverMail.setEmailID(receiverEmail);
            receiverMail.setSubject("Amount Received");
            receiverMail.setMsg("You have received ₹" + amount + " from account ending with " +
                    String.valueOf(senderAccount.getAccountNo()).substring(String.valueOf(senderAccount.getAccountNo()).length() - 4) +
                    ".\nNew Balance: ₹" + (method == PaymentMethod.NEFT ? payeeAccount.getBalance() : payeeNewBalance));

            mailClient.sendMail(receiverMail);
        } catch (Exception e) {
            System.out.println("Email send to receiver failed: " + e.getMessage());
        }

        return savedTxn;
    }

    private void validateTransactionPassword(AccountDTO account, String providedPassword) {
        if (!account.getTransactionPassword().equals(providedPassword)) {
            throw new TransactionException("Invalid transaction password.");
        }
    }

    @Override
    public List<Transactions> getTransactionsByAccount(Long accountNumber) {
        return transactionsRepository.findBySenderAccountNoOrReceiverAccountNo(accountNumber, accountNumber);
    }

    private Map<String, String> buildBalanceUpdateRequest(double newBalance) {
        Map<String, String> updateRequest = new HashMap<>();
        updateRequest.put("fieldName", "balance");
        updateRequest.put("value", String.valueOf(newBalance));
        return updateRequest;
    }
}