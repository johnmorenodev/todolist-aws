package com.todo.app.transaction;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.todo.app.account.Account;
import com.todo.app.transaction.model.TransactionFilter;

public interface TransactionRepositoryCustom {
    List<Transaction> findByAccountWithFilters(Account account, TransactionFilter filter, Pageable pageable);
}

