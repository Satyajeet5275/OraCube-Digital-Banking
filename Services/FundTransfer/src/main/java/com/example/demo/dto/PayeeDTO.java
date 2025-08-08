package com.example.demo.dto;

public class PayeeDTO {

    private Long payeeId;
    private Long payeeAccountNumber;
    private String payeeName;
    private String bankName;
    private String ifscCode;
    private String nickname;
    private Long customerId;
    private Long senderAccountNumber;

    // === Constructors ===

    public PayeeDTO() {}

    public PayeeDTO(Long payeeId, Long payeeAccountNumber, String payeeName,
                    String bankName, String ifscCode, String nickname,
                    Long customerId, Long senderAccountNumber) {
        this.payeeId = payeeId;
        this.payeeAccountNumber = payeeAccountNumber;
        this.payeeName = payeeName;
        this.bankName = bankName;
        this.ifscCode = ifscCode;
        this.nickname = nickname;
        this.customerId = customerId;
        this.senderAccountNumber = senderAccountNumber;
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
}
