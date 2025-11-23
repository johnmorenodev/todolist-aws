package com.todo.app.transaction;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todo.app.account.Account;
import com.todo.app.account.AccountRepository;
import com.todo.app.common.response.ApiResponse;
import com.todo.app.transaction.model.TransactionCreateRequest;
import com.todo.app.transaction.model.TransactionResponse;
import com.todo.app.transactionType.TransactionType;
import com.todo.app.transactionType.TransactionTypeRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final AccountRepository accountRepository;
    private final TransactionTypeRepository transactionTypeRepository;

    @PostMapping
    public ResponseEntity<ApiResponse> addNewTransaction(
            @RequestBody TransactionCreateRequest request) {
        Optional<Account> optAccount = accountRepository.findTopById(request.getAccountId());

        if (optAccount.isEmpty()) {
            throw new Error();
        }

        Optional<TransactionType> optTransType = transactionTypeRepository.findTopByName(request.getTransactionType());

        if (optAccount.isEmpty()) {
            throw new Error();

        }

        transactionService.createNewTransaction(optTransType.get(), request.getAmount(), optAccount.get(), request.getDescription(), request.getTransactionDate());
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsByAccount(
            @PathVariable Integer accountId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String transactionType) {
        Optional<Account> optAccount = accountRepository.findTopById(accountId);

        if (optAccount.isEmpty()) {
            throw new Error();
        }

        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        
        if (startDate != null && !startDate.isEmpty()) {
            try {
                startDateTime = LocalDateTime.parse(startDate, DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception e) {
                // Invalid date format, ignore
            }
        }
        
        if (endDate != null && !endDate.isEmpty()) {
            try {
                endDateTime = LocalDateTime.parse(endDate, DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception e) {
                // Invalid date format, ignore
            }
        }

        List<TransactionResponse> transactions = transactionService.getTransactions(
            optAccount.get(), 
            page, 
            limit, 
            search, 
            startDateTime, 
            endDateTime, 
            transactionType
        );
        return ResponseEntity.ok(ApiResponse.ok(transactions));
    }
}
