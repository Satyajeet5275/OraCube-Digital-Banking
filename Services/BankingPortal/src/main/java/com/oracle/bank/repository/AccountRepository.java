package com.oracle.bank.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.bank.model.Account;

public interface AccountRepository extends JpaRepository<Account,Long> {
	Optional<Account> findByCustomer_CustomerId(Long customerId);

}