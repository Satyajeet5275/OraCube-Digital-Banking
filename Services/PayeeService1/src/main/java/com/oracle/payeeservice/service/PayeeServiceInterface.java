// File: com.oracle.payeeservice.service.PayeeServiceInterface.java
package com.oracle.payeeservice.service;

import com.oracle.payeeservice.entities.Payee;
import java.util.List;

public interface PayeeServiceInterface {
	
	
	// Add this updated method instead of the old addPayee()
	Payee addPayee(Payee payee, Long customerId, Long senderAccountNumber);

	// Modify delete method to accept customerId and senderAccountNumber
	void deletePayee(Long id, Long customerId, Long senderAccountNumber);


   

    List<Payee> getPayeeList();

    Payee getPayeeById(Long id);

    List<Payee> getPayeesByCustomerId(Long customerId);

    

    // ✅ Fetch payees by customer and account number
    List<Payee> getPayeesByCustomerAndAccount(Long customerId, Long payeeAccountNumber);
}
