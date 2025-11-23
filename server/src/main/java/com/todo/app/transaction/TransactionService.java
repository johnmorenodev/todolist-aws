package com.todo.app.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.todo.app.account.Account;
import com.todo.app.transaction.model.TransactionFilter;
import com.todo.app.transaction.model.TransactionResponse;
import com.todo.app.transactionType.TransactionType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public void createNewTransaction(TransactionType transactionType, BigDecimal amount, Account account, String description, LocalDateTime transactionDate) {
        Transaction newTransaction = new Transaction();
        newTransaction.setAccount(account);
        newTransaction.setAmount(amount);
        newTransaction.setTransactionType(transactionType);
        newTransaction.setDescription(description);
        if (transactionDate != null) {
            newTransaction.setTransactionDate(transactionDate);
        }

        transactionRepository.save(newTransaction);
    }

    public List<TransactionResponse> getRecentTransactions(Account account, int limit) {
        TransactionFilter emptyFilter = new TransactionFilter(null, null, null, null);
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "date"));
        
        List<Transaction> transactions = transactionRepository.findByAccountWithFilters(account, emptyFilter, pageable);
        
        return transactions.stream().map(this::toTransactionResponse).collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsPage(
        Account account,
        int page,
        int size,
        TransactionFilter filter
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        
        List<Transaction> transactions = transactionRepository.findByAccountWithFilters(account, filter, pageable);
        
        return transactions.stream().map(this::toTransactionResponse).collect(Collectors.toList());
    }

    private TransactionResponse toTransactionResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setAmount(transaction.getAmount());
        response.setTransactionType(transaction.getTransactionType().getName());
        response.setDescription(transaction.getDescription());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setCreatedAt(transaction.getCreatedAt());
        return response;
    }
}
