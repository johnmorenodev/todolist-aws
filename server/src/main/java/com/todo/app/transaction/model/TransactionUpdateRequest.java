package com.todo.app.transaction.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TransactionUpdateRequest {
    private BigDecimal amount;
    private String transactionType;
    private String description;
    private LocalDateTime transactionDate;
}

