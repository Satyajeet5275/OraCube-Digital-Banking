package com.oracle.bank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private MailService mailService;

    private static final int EXPIRATION_MINUTES = 5;

    private Map<String, OtpDetails> otpStore = new ConcurrentHashMap<>();

    public String generateAndSendOtp(String emailID) {
        String otp = String.format("%06d", new Random().nextInt(999999));

        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);
        otpStore.put(emailID, new OtpDetails(otp, expiryTime));

        String subject = "Your OTP for Login - Bank Portal";
        String message = "Hello Customer,\n\nYour OTP for login is: " + otp +
                "\nThis OTP is valid for only " + EXPIRATION_MINUTES + " minutes.\n" +
                "If you did not request this OTP, please ignore this email.\n\n" +
                "Thanks & Regards,\nBank Portal Security Team";

        return mailService.sendMail(emailID, subject, message);
    }

    public boolean validateOtp(String emailID, String enteredOtp) {
        if (!otpStore.containsKey(emailID)) return false;

        OtpDetails otpDetails = otpStore.get(emailID);

        if (otpDetails.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpStore.remove(emailID);
            return false;
        }

        boolean isValid = otpDetails.getOtp().equals(enteredOtp);
        if (isValid) otpStore.remove(emailID); // OTP used, remove from store

        return isValid;
    }

    private static class OtpDetails {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OtpDetails(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}
