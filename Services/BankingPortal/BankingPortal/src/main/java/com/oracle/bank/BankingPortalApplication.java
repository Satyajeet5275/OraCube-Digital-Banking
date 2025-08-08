package com.oracle.bank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BankingPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankingPortalApplication.class, args);
		System.out.println("Applicant Service Started :)");
	}

}
