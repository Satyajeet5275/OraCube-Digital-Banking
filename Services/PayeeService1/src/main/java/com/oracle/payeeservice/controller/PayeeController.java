package com.oracle.payeeservice.controller;

import com.oracle.payeeservice.entities.Payee;
import com.oracle.payeeservice.service.PayeeServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "http://127.0.0.1:5501")
@RestController
@RequestMapping("/api/payees")
public class PayeeController {

    @Autowired
    private PayeeServiceInterface payeeService;

    // ✅ Add Payee with customerId and senderAccountNumber
    @PostMapping("/{customerId}/{senderAccountNumber}/add")
    public Payee addPayee(
            @RequestBody Payee payee,
            @PathVariable Long customerId,
            @PathVariable Long senderAccountNumber) {
        return payeeService.addPayee(payee, customerId, senderAccountNumber);
    }

    // ✅ Get All Payees
    @GetMapping("/all")
    public List<Payee> getAllPayees() {
        return payeeService.getPayeeList();
    }

    // ✅ Get Payee by ID
    @GetMapping("/{id}")
    public Payee getPayeeById(@PathVariable Long id) {
        return payeeService.getPayeeById(id);
    }

    // ✅ Get Payees by Customer ID
    @GetMapping("/customer/{customerId}")
    public List<Payee> getPayeesByCustomerId(@PathVariable Long customerId) {
        return payeeService.getPayeesByCustomerId(customerId);
    }

    // ✅ Delete Payee with customerId and senderAccountNumber
    @DeleteMapping("/{customerId}/{senderAccountNumber}/delete/{id}")
    public String deletePayee(
            @PathVariable Long customerId,
            @PathVariable Long senderAccountNumber,
            @PathVariable Long id) {
        payeeService.deletePayee(id, customerId, senderAccountNumber);
        return "Payee with ID " + id + " deleted successfully.";
    }
//    @CrossOrigin(origins = "*") // Or use your frontend's URL for better security
   
    @GetMapping("/{customerId}/{senderAccountNumber}/payees")
    public ResponseEntity<?> getPayeesByCustomerAndAccount(
            @PathVariable Long customerId,
            @PathVariable Long senderAccountNumber) {
        try {
            List<Payee> payees = payeeService.getPayeesByCustomerAndAccount(customerId, senderAccountNumber);
            return ResponseEntity.ok(payees);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Error fetching payees: " + e.getMessage());
        }
    }
}
