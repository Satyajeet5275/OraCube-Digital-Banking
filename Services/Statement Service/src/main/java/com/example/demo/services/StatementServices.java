package com.example.demo.services;
import com.example.demo.dto.*;

import java.time.LocalDateTime;
import java.util.List;

public interface StatementServices {
	 List<TransactionStatementDTO> getAllTransactions(Long accountNo);

	    List<TransactionStatementDTO> getTransactionsByType(Long accountNo, String type);

	    List<TransactionStatementDTO> getTransactionsByDateRange(Long accountNo, LocalDateTime from, LocalDateTime to);

	    List<TransactionStatementDTO> getLastWeekTransactions(Long accountNo);

	    List<TransactionStatementDTO> getLastSixMonthsTransactions(Long accountNo);

	    List<TransactionStatementDTO> getTransactionsByAmountRange(Long accountNo, Double minAmount, Double maxAmount);
	    
	    List<TransactionStatementDTO> getLastNTransactions(Long accountNo, int count);
	    
	    AccountBalanceDTO getAccountBalance(Long accountNo);
	    
	    void sendStatementEmail(Long accountNo, List<TransactionStatementDTO> transactions);

	    



}
