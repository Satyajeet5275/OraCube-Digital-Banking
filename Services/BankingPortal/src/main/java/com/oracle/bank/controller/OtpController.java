package com.oracle.bank.controller;

import com.oracle.bank.service.OtpService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public String sendOtp(@RequestBody OtpRequest request) {
        return otpService.generateAndSendOtp(request.getEmailID());
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("emailID");
        String otp = request.get("otp");

        boolean isValid = otpService.validateOtp(email, otp);
        Map<String, Object> response = new HashMap<>();

        if (isValid) {
            response.put("status", true);
            response.put("message", "OTP Verified Successfully!");
        } else {
            response.put("status", false);
            response.put("message", "Invalid or Expired OTP!");
        }

        return ResponseEntity.ok(response);
    }


    public static class OtpRequest {
        private String emailID;
        public String getEmailID() { return emailID; }
        public void setEmailID(String emailID) { this.emailID = emailID; }
    }

    public static class OtpVerifyRequest {
        private String emailID;
        private String otp;
        public String getEmailID() { return emailID; }
        public void setEmailID(String emailID) { this.emailID = emailID; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }
}
