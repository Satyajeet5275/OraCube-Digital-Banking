package com.oracle.bank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.bank.model.AccountRequest;

public interface AccountRequestRepository extends JpaRepository<AccountRequest,Long> {

}