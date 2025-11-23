package com.todo.app.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.todo.app.account.Account;
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
        return getTransactions(account, 0, limit);
    }

    public List<TransactionResponse> getTransactions(Account account, int page, int limit) {
        return getTransactions(account, page, limit, null);
    }

    public List<TransactionResponse> getTransactions(Account account, int page, int limit, String search) {
        return getTransactions(account, page, limit, search, null, null, null);
    }

    public List<TransactionResponse> getTransactions(
        Account account, 
        int page, 
        int limit, 
        String search, 
        LocalDateTime startDate, 
        LocalDateTime endDate, 
        String transactionType
    ) {
        List<Transaction> transactions;
        
        boolean hasFilters = (startDate != null || endDate != null || 
                             (transactionType != null && !transactionType.trim().isEmpty()) ||
                             (search != null && !search.trim().isEmpty()));
        
        if (hasFilters) {
            int offset = page * limit;
            // Use sentinel values for NULL parameters to avoid PostgreSQL type inference issues
            LocalDateTime sentinelStartDate = LocalDateTime.of(1970, 1, 1, 0, 0, 0);
            LocalDateTime sentinelEndDate = LocalDateTime.of(9999, 12, 31, 23, 59, 59);
            
            transactions = transactionRepository.findByAccountWithFilters(
                account.getId(),
                search != null && !search.trim().isEmpty() ? search.trim() : "",
                startDate != null ? startDate : sentinelStartDate,
                endDate != null ? endDate : sentinelEndDate,
                transactionType != null && !transactionType.equals("all") ? transactionType : "",
                limit,
                offset
            );
        } else {
            transactions = transactionRepository.findByAccountOrderByCreatedAtDesc(
                account, 
                PageRequest.of(page, limit)
            );
        }
        
        return transactions.stream().map(transaction -> {
            TransactionResponse response = new TransactionResponse();
            response.setId(transaction.getId());
            response.setAmount(transaction.getAmount());
            response.setTransactionType(transaction.getTransactionType().getName());
            response.setDescription(transaction.getDescription());
            response.setTransactionDate(transaction.getTransactionDate());
            response.setCreatedAt(transaction.getCreatedAt());
            return response;
        }).collect(Collectors.toList());
    }
}
