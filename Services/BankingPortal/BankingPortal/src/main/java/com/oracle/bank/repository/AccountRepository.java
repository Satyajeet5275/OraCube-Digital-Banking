package com.oracle.bank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.bank.model.Account;

public interface AccountRepository extends JpaRepository<Account,Long> {

}