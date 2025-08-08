package com.oracle.payeeservice.service;

import com.oracle.payeeservice.dto.MailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "mail-service", url = "http://localhost:8081/mail")
public interface MailClient {

    @PostMapping("/send")
    String sendMail(@RequestBody MailRequest request);
}