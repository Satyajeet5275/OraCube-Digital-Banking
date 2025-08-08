package com.oracle.payeeservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.oracle.payeeservice.service")
public class PayeeServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PayeeServiceApplication.class, args);
        System.out.println("Payee Service Started");
    }

    // Register RestTemplate as a Spring bean with LoadBalanced for Eureka service discovery
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
