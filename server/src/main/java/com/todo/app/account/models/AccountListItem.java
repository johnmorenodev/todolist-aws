package com.todo.app.account.models;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AccountListItem {
    private Long accountId;
    private String name;
    private BigDecimal balance;
}

