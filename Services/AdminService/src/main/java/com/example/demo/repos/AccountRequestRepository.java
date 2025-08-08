package com.example.demo.repos;

import com.example.demo.entities.AccountRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRequestRepository extends JpaRepository<AccountRequest, Long> {
	
}