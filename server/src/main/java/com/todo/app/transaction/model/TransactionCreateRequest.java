package com.todo.app.transaction.model;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class TransactionCreateRequest {
    private BigDecimal amount;
    private String transactionType;
    private Integer accountId;
}
