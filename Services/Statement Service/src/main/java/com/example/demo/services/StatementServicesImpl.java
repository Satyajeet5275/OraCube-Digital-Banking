//package com.example.demo.services;
//
//import com.example.demo.dto.TransactionStatementDTO;
//import com.example.demo.dto.*;
//import com.example.demo.exceptions.CustomException;
//import com.example.demo.projection.TransactionStatement;
//import com.example.demo.repository.TransactionRepository;
//import com.example.demo.repository.*;
//import com.example.demo.entities.*;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class StatementServicesImpl implements StatementServices {
//
//    @Autowired
//    private final TransactionRepository transactionRepository;
//    
//    @Autowired
//    private AccountRepository accountRepository;
//
//    public StatementServicesImpl(TransactionRepository transactionRepository,AccountRepository accountRepository) {
//        this.transactionRepository = transactionRepository;
//        this.accountRepository = accountRepository;
//    }
//
//    @Override
//    public List<TransactionStatementDTO> getAllTransactions(Long accountNo) {
//        List<TransactionStatement> result = transactionRepository.findAllByAccountNo(accountNo);
//        if (result.isEmpty()) {
//            throw new CustomException("No transactions found!", HttpStatus.NOT_FOUND);
//        }
//        return result.stream().map(txn -> mapToDTO(txn, accountNo)).collect(Collectors.toList());
//
//    }
//
//    @Override
//    public List<TransactionStatementDTO> getTransactionsByType(Long accountNo, String type) {
//        List<TransactionStatement> result = transactionRepository.findByTypeAndAccountNo(accountNo, type);
//        if (result.isEmpty()) {
//            throw new CustomException("No transactions found!", HttpStatus.NOT_FOUND);
//        }
//        return result.stream().map(txn -> mapToDTO(txn, accountNo)).collect(Collectors.toList());
//
//    }
//
//    @Override
//    public List<TransactionStatementDTO> getTransactionsByDateRange(Long accountNo, LocalDateTime from,
//                                                                     LocalDateTime to) {
//        List<TransactionStatement> result = transactionRepository.findByAccountNoAndDateRange(accountNo, from, to);
//        if (result.isEmpty()) {
//            throw new CustomException("No transactions found!", HttpStatus.NOT_FOUND);
//        }
//        return result.stream().map(txn -> mapToDTO(txn, accountNo)).collect(Collectors.toList());
//
//    }
//
//    @Override
//    public List<TransactionStatementDTO> getLastWeekTransactions(Long accountNo) {
//        LocalDateTime to = LocalDateTime.now();
//        LocalDateTime from = to.minusWeeks(1);
//
//        List<TransactionStatement> summaries = transactionRepository.findByAccountNoAndDateRange(accountNo, from, to);
//
//        if (summaries.isEmpty()) {
//            throw new CustomException("No transactions found in last week!", HttpStatus.NOT_FOUND);
//        }
//
//        return summaries.stream().map(txn -> mapToDTO(txn, accountNo)).collect(Collectors.toList());
//
//    }
//
//    @Override
//    public List<TransactionStatementDTO> getLastSixMonthsTransactions(Long accountNo) {
//        LocalDateTime to = LocalDateTime.now();
//        LocalDateTime from = to.minusMonths(6);
//
//        List<TransactionStatement> summaries = transactionRepository.findByAccountNoAndDateRange(accountNo, from, to);
//
//        if (summaries.isEmpty()) {
//            throw new CustomException("No transactions found in last 6 months!", HttpStatus.NOT_FOUND);
//        }
//
//        return summaries.stream().map(txn -> mapToDTO(txn, accountNo)).collect(Collectors.toList());
//
//    }
//
//    @Override
//    public List<TransactionStatementDTO> getTransactionsByAmountRange(Long accountNo, Double minAmount, Double maxAmount) {
//        List<TransactionStatement> results = transactionRepository.findByAccountNoAndAmountRange(accountNo, minAmount, maxAmount);
//        if (results.isEmpty()) {
//            throw new CustomException("No transactions found!", HttpStatus.NOT_FOUND);
//        }
//        return results.stream().map(txn -> mapToDTO(txn, accountNo)).collect(Collectors.toList());
//
//    }
//    
//    @Override
//    public List<TransactionStatementDTO> getLastNTransactions(Long accountNo, int count) {
//    	Pageable pageable = PageRequest.of(0, count);
//        List<TransactionStatement> result = transactionRepository.findLastNTransactions(accountNo, pageable);
//        if (result.isEmpty()) {
//            throw new CustomException("No transactions found!", HttpStatus.NOT_FOUND);
//        }
//        return result.stream().map(txn -> mapToDTO(txn, accountNo)).collect(Collectors.toList());
//
//    }
//    
//    @Override
//    public AccountBalanceDTO getAccountBalance(Long accountNo) {
//        // Example: assume you have a method to get the latest balance:
//    	 Account account = accountRepository.findById(accountNo)
//                .orElseThrow(() -> new CustomException("Account not found!", HttpStatus.NOT_FOUND));
//    	 BigDecimal availableBalance = account.getBalance();
//    	    BigDecimal effectiveBalance = availableBalance; // ✅ same for now
//
//    	    return new AccountBalanceDTO(accountNo, availableBalance, effectiveBalance);
//    }
//
//
//
//    private TransactionStatementDTO mapToDTO(TransactionStatement summary,Long accountNo) {
//    	String transactionType = summary.getSenderAccountNo().equals(accountNo) ? "Debit" : "Credit";
//    	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
//    	
//    	  String dynamicRemark = summary.getRemarks();
//    	    if (transactionType.equals("Debit")) {
//    	        dynamicRemark += " / To Account: " + summary.getReceiverAccountNo();
//    	    } else {
//    	        dynamicRemark += " / From Account: " + summary.getSenderAccountNo();
//    	    }
//
//        return new TransactionStatementDTO(
//                summary.getTransactionId(),
//                summary.getTransactionDate().format(formatter),
//                transactionType,
//                summary.getPaymentMethod(),
//                dynamicRemark,
//                summary.getAmount(),
//                summary.getBalanceAfterTxn()
//        );
//    }
//}


package com.example.demo.services;

import com.example.demo.services.TransactionClient;
import com.example.demo.services.AccountClient;
import com.example.demo.dto.*;
import com.example.demo.exceptions.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatementServicesImpl implements StatementServices {

    @Autowired
    private TransactionClient transactionClient;

    @Autowired
    private AccountClient accountClient;
    
    @Autowired
    private MailClient mailClient;
    
    @Autowired
    private CustomerClient customerClient;


    @Override
    public List<TransactionStatementDTO> getAllTransactions(Long accountNo) {
        List<TransactionDTO> result = transactionClient.getTransactionsByAccount(accountNo);
        
        if (result.isEmpty()) {
            throw new CustomException("No transactions found!", HttpStatus.NOT_FOUND);
        }

        List<TransactionStatementDTO> transactions = result.stream()
                .map(txn -> mapToDTO(txn, accountNo))
                .collect(Collectors.toList());

        // ✅ Call the email logic here
        sendStatementEmail(accountNo, transactions);

        return transactions;
    }


    @Override
    public List<TransactionStatementDTO> getTransactionsByType(Long accountNo, String type) {
        List<TransactionDTO> result = transactionClient.getTransactionsByAccount(accountNo);
        
        List<TransactionDTO> filtered = result.stream()
                .filter(txn -> txn.getTransactionType().name().equalsIgnoreCase(type))
                .collect(Collectors.toList());

        if (filtered.isEmpty()) {
            throw new CustomException("No transactions found!", HttpStatus.NOT_FOUND);
        }

        return filtered.stream()
                .map(txn -> mapToDTO(txn, accountNo))
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionStatementDTO> getTransactionsByDateRange(Long accountNo, LocalDateTime from, LocalDateTime to) {
        List<TransactionDTO> result = transactionClient.getTransactionsByAccount(accountNo);
        List<TransactionDTO> filtered = result.stream()
                .filter(txn -> txn.getTransactionDate().isAfter(from) && txn.getTransactionDate().isBefore(to))
                .collect(Collectors.toList());
        if (filtered.isEmpty()) {
            throw new CustomException("No transactions found!", HttpStatus.NOT_FOUND);
        }
        return filtered.stream().map(txn -> mapToDTO(txn, accountNo)).collect(Collectors.toList());
    }

    @Override
    public List<TransactionStatementDTO> getLastWeekTransactions(Long accountNo) {
        LocalDateTime to = LocalDateTime.now();
        LocalDateTime from = to.minusWeeks(1);
        return getTransactionsByDateRange(accountNo, from, to);
    }

    @Override
    public List<TransactionStatementDTO> getLastSixMonthsTransactions(Long accountNo) {
        LocalDateTime to = LocalDateTime.now();
        LocalDateTime from = to.minusMonths(6);
        return getTransactionsByDateRange(accountNo, from, to);
    }

    @Override
    public List<TransactionStatementDTO> getTransactionsByAmountRange(Long accountNo, Double minAmount, Double maxAmount) {
        List<TransactionDTO> result = transactionClient.getTransactionsByAccount(accountNo);
        List<TransactionDTO> filtered = result.stream()
                .filter(txn -> txn.getAmount() >= minAmount && txn.getAmount() <= maxAmount)
                .collect(Collectors.toList());
        if (filtered.isEmpty()) {
            throw new CustomException("No transactions found!", HttpStatus.NOT_FOUND);
        }
        return filtered.stream().map(txn -> mapToDTO(txn, accountNo)).collect(Collectors.toList());
    }

    @Override
    public List<TransactionStatementDTO> getLastNTransactions(Long accountNo, int count) {
        List<TransactionDTO> result = transactionClient.getTransactionsByAccount(accountNo);
        List<TransactionDTO> sorted = result.stream()
                .sorted(Comparator.comparing(TransactionDTO::getTransactionDate).reversed())
                .limit(count)
                .collect(Collectors.toList());
        if (sorted.isEmpty()) {
            throw new CustomException("No transactions found!", HttpStatus.NOT_FOUND);
        }
        return sorted.stream().map(txn -> mapToDTO(txn, accountNo)).collect(Collectors.toList());
    }

    @Override
    public AccountBalanceDTO getAccountBalance(Long accountNo) {
        return accountClient.getAccountBalance(accountNo);
    }

    private TransactionStatementDTO mapToDTO(TransactionDTO summary, Long accountNo) {
        String transactionType = summary.getSenderAccountNo().equals(accountNo) ? "Debit" : "Credit";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        String dynamicRemark = summary.getRemarks();
        if (transactionType.equals("Debit")) {
            dynamicRemark += " / To Account: " + summary.getReceiverAccountNo();
        } else {
            dynamicRemark += " / From Account: " + summary.getSenderAccountNo();
        }

        return new TransactionStatementDTO(
                summary.getTransactionId(),
                summary.getTransactionDate().format(formatter),
                transactionType,
                summary.getPaymentMethod().toString(),
                dynamicRemark,
                BigDecimal.valueOf(summary.getAmount()),
                BigDecimal.valueOf(summary.getBalanceAfterTxn())
        );
    }
    @Override
    public void sendStatementEmail(Long accountNo, List<TransactionStatementDTO> transactions) {
        try {
            // 1. Get account and customer info
            AccountDTO account = accountClient.getAccountById(accountNo);
            Long customerId = account.getCustomerId();
            String email = customerClient.getCustomerEmail(customerId);

            // 2. Build email body
            StringBuilder msg = new StringBuilder();
            msg.append("🧾 Transaction Statement\n");
            msg.append("📌 Account Number: ").append(accountNo).append("\n");
            msg.append("👤 Customer ID: ").append(customerId).append("\n\n");

            if (transactions.isEmpty()) {
                msg.append("❗ No transactions found for this account.");
            } else {
                msg.append("Here are your recent transactions:\n\n");

                String border = "+-----------------+--------------+------------+------------+--------------------------------------------------+\n";
                String header = "| Transaction ID  | Date         | Type       | Amount     | Remarks                                          |\n";

                msg.append(border);
                msg.append(header);
                msg.append(border);

                for (TransactionStatementDTO txn : transactions) {
                    String cleanedRemark = cleanRemark(txn.getRemarks());
                    msg.append(String.format(
                        "| %-15s | %-12s | %-10s | %-10s | %-48s |\n",
                        txn.getTransactionId(),
                        txn.getTransactionDate(),
                        txn.getTransactionType(),
                        "₹" + txn.getAmount(),
                        truncate(cleanedRemark, 48)
                    ));
                }

                msg.append(border);
            }

            // 3. Mail request
            MailRequest mail = new MailRequest();
            mail.setEmailID(email);
            mail.setSubject("📨 Your Transaction Statement");
            mail.setMsg(msg.toString());

            // 4. Send
            System.out.println("📧 Sending statement mail to: " + email);
            String response = mailClient.sendMail(mail);
            System.out.println("📨 Mail client response: " + response);

        } catch (Exception e) {
            System.out.println("❌ Failed to send statement email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // ✅ Truncates remark if too long
    private String truncate(String text, int maxLength) {
        if (text == null) return "";
        return text.length() <= maxLength ? text : text.substring(0, maxLength - 3) + "...";
    }

    // ✅ Removes unnecessary account info from remark
    private String cleanRemark(String remark) {
        if (remark == null) return "";
        if (remark.contains("/ To Account:")) {
            return remark.split("/ To Account:")[0].trim();
        } else if (remark.contains("/ From Account:")) {
            return remark.split("/ From Account:")[0].trim();
        }
        return remark.trim();
    }



}




