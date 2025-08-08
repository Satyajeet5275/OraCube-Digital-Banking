//package com.oracle.payeeservice.entities;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "payee")
//public class Payee {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "payee_id")
//    private Long payeeId;
//
//    @Column(name = "payee_name")
//    private String payeeName;
//
//    @Column(name = "payee_account_number")
//    private Long payeeAccountNumber;  // ✅ numeric now
//
//    @Column(name = "ifsc_code")
//    private String ifscCode;
//
//    @Column(name = "bank_name")
//    private String bankName;
//
//    @Column(name = "nickname")
//    private String nickname;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt = LocalDateTime.now();
//
//    @Column(name = "customer_id")
//    private Long customerId;  // ✅ numeric now
//
//    // ----- Getters & Setters -----
//    public Long getPayeeId() {
//        return payeeId;
//    }
//
//    public void setPayeeId(Long payeeId) {
//        this.payeeId = payeeId;
//    }
//
//    public String getPayeeName() {
//        return payeeName;
//    }
//
//    public void setPayeeName(String payeeName) {
//        this.payeeName = payeeName;
//    }
//
//    public Long getPayeeAccountNumber() {
//        return payeeAccountNumber;
//    }
//
//    public void setPayeeAccountNumber(Long payeeAccountNumber) {
//        this.payeeAccountNumber = payeeAccountNumber;
//    }
//
//    public String getIfscCode() {
//        return ifscCode;
//    }
//
//    public void setIfscCode(String ifscCode) {
//        this.ifscCode = ifscCode;
//    }
//
//    public String getBankName() {
//        return bankName;
//    }
//
//    public void setBankName(String bankName) {
//        this.bankName = bankName;
//    }
//
//    public String getNickname() {
//        return nickname;
//    }
//
//    public void setNickname(String nickname) {
//        this.nickname = nickname;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public Long getCustomerId() {
//        return customerId;
//    }
//
//    public void setCustomerId(Long customerId) {
//        this.customerId = customerId;
//    }
//}



//package com.example.demo.entities;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "PAYEE")
//public class Payee {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "PAYEE_ID", nullable = false)
//    private Long payeeId;
//
//    @Column(name = "CUSTOMER_ID", nullable = false, length = 15)
//    private String customerId;
//
//    @Column(name = "PAYEE_NAME", nullable = false, length = 100)
//    private String payeeName;
//
//    @Column(name = "PAYEE_ACCOUNT_NUMBER", nullable = false)
//    private Long payeeAccountNumber;
//
//    @Column(name = "IFSC_CODE", nullable = false, length = 15)
//    private String ifscCode;
//
//    @Column(name = "BANK_NAME", nullable = false, length = 100)
//    private String bankName;
//
//    @Column(name = "NICKNAME", length = 50)
//    private String nickname;
//
//    @Column(name = "CREATED_AT", updatable = false)
//    private LocalDateTime createdAt;
//
//    // ✅ Constructors
//    public Payee() {
//        this.createdAt = LocalDateTime.now();
//    }
//
//    public Payee(String customerId, String payeeName, Long payeeAccountNumber,
//                 String ifscCode, String bankName, String nickname) {
//        this.customerId = customerId;
//        this.payeeName = payeeName;
//        this.payeeAccountNumber = payeeAccountNumber;
//        this.ifscCode = ifscCode;
//        this.bankName = bankName;
//        this.nickname = nickname;
//        this.createdAt = LocalDateTime.now();
//    }
//
//    // ✅ Getters and Setters
//    public Long getPayeeId() {
//        return payeeId;
//    }
//
//    public void setPayeeId(Long payeeId) {
//        this.payeeId = payeeId;
//    }
//
//    public String getCustomerId() {
//        return customerId;
//    }
//
//    public void setCustomerId(String customerId) {
//        this.customerId = customerId;
//    }
//
//    public String getPayeeName() {
//        return payeeName;
//    }
//
//    public void setPayeeName(String payeeName) {
//        this.payeeName = payeeName;
//    }
//
//    public Long getPayeeAccountNumber() {
//        return payeeAccountNumber;
//    }
//
//    public void setPayeeAccountNumber(Long payeeAccountNumber) {
//        this.payeeAccountNumber = payeeAccountNumber;
//    }
//
//    public String getIfscCode() {
//        return ifscCode;
//    }
//
//    public void setIfscCode(String ifscCode) {
//        this.ifscCode = ifscCode;
//    }
//
//    public String getBankName() {
//        return bankName;
//    }
//
//    public void setBankName(String bankName) {
//        this.bankName = bankName;
//    }
//
//    public String getNickname() {
//        return nickname;
//    }
//
//    public void setNickname(String nickname) {
//        this.nickname = nickname;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//}


package com.oracle.payeeservice.entities;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "PAYEE")
public class Payee {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payee_seq")
	@SequenceGenerator(name = "payee_seq", sequenceName = "PAYEE_ID_SEQ", allocationSize = 1)
	@Column(name = "payee_id")
	
    private Long payeeId;

    @Column(name = "payee_account_number", nullable = false)
    private Long payeeAccountNumber;

    @Column(name = "payee_name")
    private String payeeName;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    // ✅ NEW FIELD: The customer's account number used to add this payee
    @Column(name = "sender_account_number", nullable = false)
    private Long senderAccountNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Payee() {
        this.createdAt = LocalDateTime.now();
    }

    // === Getters and Setters ===

    public Long getPayeeId() {
        return payeeId;
    }

    public void setPayeeId(Long payeeId) {
        this.payeeId = payeeId;
    }

    public Long getPayeeAccountNumber() {
        return payeeAccountNumber;
    }

    public void setPayeeAccountNumber(Long payeeAccountNumber) {
        this.payeeAccountNumber = payeeAccountNumber;
    }

    public String getPayeeName() {
        return payeeName;
    }

    public void setPayeeName(String payeeName) {
        this.payeeName = payeeName;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getSenderAccountNumber() {
        return senderAccountNumber;
    }

    public void setSenderAccountNumber(Long senderAccountNumber) {
        this.senderAccountNumber = senderAccountNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
