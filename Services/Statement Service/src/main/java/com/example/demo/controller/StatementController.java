package com.example.demo.controller;

//import com.example.demo.projection.TransactionStatement;
import com.example.demo.services.StatementServices;
import com.example.demo.dto.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/statements")
public class StatementController {

	@Autowired
	private final StatementServices statementService;

	public StatementController(StatementServices statementService) {
		this.statementService = statementService;
	}

	@GetMapping("/{accountNo}")
	public ResponseEntity<List<TransactionStatementDTO>> getAll(@PathVariable Long accountNo) {
	    List<TransactionStatementDTO> transactions = statementService.getAllTransactions(accountNo);
	    System.out.println("📥 Controller: preparing to send email for account: " + accountNo);
	    statementService.sendStatementEmail(accountNo, transactions); // ✅ Mail logic is here

	    return ResponseEntity.ok(transactions);
	}


	@GetMapping("/{accountNo}/type/{type}")
	public List<TransactionStatementDTO> getByType(@PathVariable Long accountNo, @PathVariable String type) {
		return statementService.getTransactionsByType(accountNo, type);
	}

	@GetMapping("/{accountNo}/range") // http://localhost:8081/api/statements/100000000005/range?from=2025-07-20&to=2025-07-24
	public List<TransactionStatementDTO> getByDateRange(@PathVariable Long accountNo,
			@RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate from,
			@RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate to) {

		return statementService.getTransactionsByDateRange(accountNo, from.atStartOfDay(), to.atTime(LocalTime.MAX));
	}

	@GetMapping("/{accountNo}/last-week")
	public List<TransactionStatementDTO> getLastWeek(@PathVariable Long accountNo) {
		return statementService.getLastWeekTransactions(accountNo);
	}

	@GetMapping("/{accountNo}/last-six-months")
	public List<TransactionStatementDTO> getLastSixMonths(@PathVariable Long accountNo) {
		return statementService.getLastSixMonthsTransactions(accountNo);
	}

	@GetMapping("/{accountNo}/amount") // http://localhost:8080/api/statements/100000000001/amount?min=1000&max=6000
	public ResponseEntity<List<TransactionStatementDTO>> getTransactionsByAmountRange(@PathVariable Long accountNo,
			@RequestParam("min") Double minAmount, @RequestParam("max") Double maxAmount) {
		return ResponseEntity.ok(statementService.getTransactionsByAmountRange(accountNo, minAmount, maxAmount));
	}

	@GetMapping("/{accountNo}/latest") // GET /api/statements/100000000003/latest?count=10
	public List<TransactionStatementDTO> getLastNTransactions(
	        @PathVariable Long accountNo,
	        @RequestParam(defaultValue = "10") int count) {
	    List<TransactionStatementDTO> transactions = statementService.getLastNTransactions(accountNo, count);
	    return transactions != null ? transactions : new ArrayList<>();
	}
	
	@GetMapping("/{accountNo}/balance")
	public ResponseEntity<AccountBalanceDTO> getAccountBalance(@PathVariable Long accountNo) {
	    AccountBalanceDTO dto = statementService.getAccountBalance(accountNo);
	    return ResponseEntity.ok(dto);
	}


	


}
