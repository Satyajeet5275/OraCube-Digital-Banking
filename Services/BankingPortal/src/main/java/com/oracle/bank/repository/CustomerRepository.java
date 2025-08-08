package com.oracle.bank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.bank.model.Customer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
	
	// Option 1 (directly fetch email string)
    @Query("SELECT c.email FROM Customer c WHERE c.customerId = :id")
    String findEmailByCustomerId(@Param("id") Long id);

    // Option 2 (fetch whole customer object)
    // Optional<Customer> findByCustomerId(Long customerId);

}