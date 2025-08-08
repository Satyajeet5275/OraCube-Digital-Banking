package com.example.demo.projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface TransactionStatement {
    Long getTransactionId();
    LocalDateTime getTransactionDate();
    String getRemarks();
    String getTransactionType();
    String getPaymentMethod();
    BigDecimal getAmount();
    BigDecimal getBalanceAfterTxn();
    Long getSenderAccountNo();
    Long getReceiverAccountNo();
}
