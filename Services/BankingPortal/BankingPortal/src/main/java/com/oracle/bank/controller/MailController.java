package com.oracle.bank.controller;

import com.oracle.bank.model.MailRequest;
import com.oracle.bank.service.MailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mail")
public class MailController {

    @Autowired
    private MailService mailService;

    @PostMapping("/send")
    public String sendMail(@RequestBody MailRequest request) {
        return mailService.sendMail(request.getEmailID(), request.getSubject(), request.getMsg());
    }
}
