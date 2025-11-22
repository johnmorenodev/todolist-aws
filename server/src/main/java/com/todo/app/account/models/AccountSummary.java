package com.todo.app.account.models;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AccountSummary {
    private String name;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal balance;
    private Long accountId;
}
