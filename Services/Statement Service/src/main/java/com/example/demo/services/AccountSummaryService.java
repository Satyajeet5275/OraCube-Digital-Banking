package com.example.demo.services;

import com.example.demo.dto.AccountSummaryDTO;

public interface AccountSummaryService {
//    AccountSummaryDTO getAccountSummary(Long customerId);
	 AccountSummaryDTO getAccountSummary(Long customerId, Long accountNo);
}
