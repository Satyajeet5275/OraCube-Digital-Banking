package com.oracle.bank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public String sendMail(String emailID, String subject, String msg) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(emailID);
            message.setSubject(subject);
            message.setText(msg);
            message.setFrom("satyajeetgaikwad2004@gmail.com");
            mailSender.send(message);
            return "Mail sent successfully to " + emailID;
        } catch (Exception e) {
            return "Failed to send mail: " + e.getMessage();
        }
    }
}
