package com.oracle.bank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.bank.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer,Long> {

}