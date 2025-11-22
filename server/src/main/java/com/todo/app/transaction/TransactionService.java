package com.todo.app.transaction;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.todo.app.account.Account;
import com.todo.app.transactionType.TransactionType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public void createNewTransaction(TransactionType transactionType, BigDecimal amount, Account account) {
        Transaction newTransaction = new Transaction();
        newTransaction.setAccount(account);
        newTransaction.setAmount(amount);
        newTransaction.setTransactionType(transactionType);

        transactionRepository.save(newTransaction);
    }
}
