package com.oracle.payeeservice.service;

import com.oracle.payeeservice.entities.Payee;
import com.oracle.payeeservice.dto.CustomerDTO; // ✅ Correct import

import com.oracle.payeeservice.dto.MailRequest;
import com.oracle.payeeservice.repos.PayeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayeeServiceImpl implements PayeeServiceInterface {

    @Autowired
    private PayeeRepository payeeRepository;

    @Autowired
    private CustomerClient customerClient;

    @Autowired
    private MailClient mailClient;

    @Override
    public List<Payee> getPayeeList() {
        return payeeRepository.findAll();
    }

    @Override
    public Payee getPayeeById(Long id) {
        return payeeRepository.findById(id).orElse(null);
    }

    @Override
    public List<Payee> getPayeesByCustomerId(Long customerId) {
        System.out.println("DEBUG: Searching payees for customerId = " + customerId);
        return payeeRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Payee> getPayeesByCustomerAndAccount(Long customerId, Long senderAccountNumber) {
        System.out.println("DEBUG: Searching payees for customerId = " + customerId + ", account = " + senderAccountNumber);
        return payeeRepository.findByCustomerIdAndSenderAccountNumber(customerId, senderAccountNumber);
    }
    @Override
    public Payee addPayee(Payee payee, Long customerId, Long senderAccountNumber) {
        // 1. Check for duplicate payee
        List<Payee> existingPayees = payeeRepository.findByCustomerIdAndSenderAccountNumber(customerId, senderAccountNumber);
        for (Payee existing : existingPayees) {
            if (existing.getPayeeAccountNumber().equals(payee.getPayeeAccountNumber())) {
                throw new RuntimeException("Payee already exists for this account.");
            }
        }

        // 2. Save new payee
        payee.setCustomerId(customerId);
        payee.setSenderAccountNumber(senderAccountNumber);
        Payee savedPayee = payeeRepository.save(payee);
        System.out.println("✅ New payee saved: " + savedPayee.getPayeeName());

        // 3. Fetch customer details and send mail
        try {
        	CustomerDTO customer = customerClient.getCustomerById(customerId);

            if (customer != null && customer.getEmail() != null) {

                String email = customer.getEmail();
                String message = "You have successfully added a new payee: " + payee.getPayeeName();

                MailRequest mail = new MailRequest();
                mail.setEmailID(email);
                mail.setSubject("Payee Added");
                mail.setMsg(message);

                System.out.println("📧 Sending payee added mail to: " + email);
                String response = mailClient.sendMail(mail);
                System.out.println("📨 Mail client response: " + response);

            } else {
                System.out.println("⚠️ Customer or customer email not found. Mail not sent.");
            }

        } catch (Exception e) {
            System.out.println("❌ Failed to send payee added mail: " + e.getMessage());
            e.printStackTrace();
        }

        return savedPayee;
    }



    @Override
    public void deletePayee(Long id, Long customerId, Long senderAccountNumber) {
        Payee payee = payeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payee not found with ID: " + id));

        if (!payee.getCustomerId().equals(customerId) ||
            !payee.getSenderAccountNumber().equals(senderAccountNumber)) {
            throw new RuntimeException("Unauthorized delete attempt: Customer ID or Sender Account does not match.");
        }

        payeeRepository.deleteById(id);

        // ✅ Optional: Send email after deletion
        try {
        	CustomerDTO customer = customerClient.getCustomerById(customerId);

            if (customer != null && customer.getEmail() != null) {
                MailRequest mail = new MailRequest();
                mail.setEmailID(customer.getEmail());
                mail.setSubject("Payee Deleted");
                mail.setMsg("Payee '" + payee.getPayeeName() + "' has been successfully removed from your account.");
                mailClient.sendMail(mail);
            }
        } catch (Exception e) {
            System.out.println("WARNING: Failed to send mail after deleting payee: " + e.getMessage());
        }
    }
}
