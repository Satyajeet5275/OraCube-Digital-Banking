package com.oracle.bank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.oracle.bank.service")
public class BankingPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankingPortalApplication.class, args);
		System.out.println("Applicant Service Started :)");
	}

}
