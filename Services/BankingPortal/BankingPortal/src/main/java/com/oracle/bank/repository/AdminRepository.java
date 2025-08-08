package com.oracle.bank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.bank.model.Account;
import com.oracle.bank.model.Admin;

public interface AdminRepository extends JpaRepository<Admin,Long> {

}