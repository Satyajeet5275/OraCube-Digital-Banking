package com.oracle.payeeservice.repos;

import com.oracle.payeeservice.entities.Payee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PayeeRepository extends JpaRepository<Payee, Long> {

    List<Payee> findByCustomerId(Long customerId);
    
    


    // Fetch payees added for a specific payee account number
    List<Payee> findByPayeeAccountNumber(Long payeeAccountNumber);

    // Fetch payee added by a customer to a specific payee account number
    List<Payee> findByCustomerIdAndPayeeAccountNumber(Long customerId, Long payeeAccountNumber);

    // ✅ NEW: Fetch payees by customer and their own sender account number
    List<Payee> findByCustomerIdAndSenderAccountNumber(Long customerId, Long senderAccountNumber);
}
