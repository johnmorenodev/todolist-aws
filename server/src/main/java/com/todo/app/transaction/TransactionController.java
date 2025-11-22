package com.todo.app.transaction;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todo.app.account.Account;
import com.todo.app.account.AccountRepository;
import com.todo.app.common.response.ApiResponse;
import com.todo.app.transaction.model.TransactionCreateRequest;
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

        transactionService.createNewTransaction(optTransType.get(), request.getAmount(), optAccount.get());
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
