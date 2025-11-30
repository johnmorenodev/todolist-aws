package com.todo.app.transaction;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.todo.app.account.Account;
import com.todo.app.account.AccountRepository;
import com.todo.app.auth.AuthHelper;
import com.todo.app.common.response.ApiResponse;
import com.todo.app.transaction.model.TransactionCreateRequest;
import com.todo.app.transaction.model.TransactionFilter;
import com.todo.app.transaction.model.TransactionResponse;
import com.todo.app.transaction.model.TransactionUpdateRequest;
import com.todo.app.transactionType.TransactionType;
import com.todo.app.transactionType.TransactionTypeRepository;
import com.todo.app.user.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final AccountRepository accountRepository;
    private final TransactionTypeRepository transactionTypeRepository;
    private final TransactionRepository transactionRepository;
    private final AuthHelper authHelper;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addNewTransaction(
            @RequestBody TransactionCreateRequest request) {
        Optional<Account> optAccount = accountRepository.findTopById(request.getAccountId());

        if (optAccount.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found");
        }

        Optional<TransactionType> optTransType = transactionTypeRepository.findTopByName(request.getTransactionType());

        if (optTransType.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid transaction type");
        }

        transactionService.createNewTransaction(optTransType.get(), request.getAmount(), optAccount.get(), request.getDescription(), request.getTransactionDate());
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @GetMapping("/account/{accountId}/recent")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getRecentTransactions(
            @PathVariable Integer accountId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String transactionType) {
        Optional<Account> optAccount = accountRepository.findTopById(accountId);

        if (optAccount.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found");
        }

        List<TransactionResponse> transactions = transactionService.getRecentTransactions(optAccount.get(), limit, transactionType);
        return ResponseEntity.ok(ApiResponse.ok(transactions));
    }

    @GetMapping("/account/{accountId}/list")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsList(
            @PathVariable Integer accountId,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String transactionType) {
        Optional<Account> optAccount = accountRepository.findTopById(accountId);

        if (optAccount.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found");
        }

        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        
        if (startDate != null && !startDate.isEmpty()) {
            try {
                startDateTime = LocalDateTime.parse(startDate, DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid startDate format");
            }
        }
        
        if (endDate != null && !endDate.isEmpty()) {
            try {
                endDateTime = LocalDateTime.parse(endDate, DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid endDate format");
            }
        }

        TransactionFilter filter = new TransactionFilter(search, startDateTime, endDateTime, transactionType);
        List<TransactionResponse> transactions = transactionService.getTransactionsPage(
            optAccount.get(), 
            page, 
            size, 
            filter
        );
        return ResponseEntity.ok(ApiResponse.ok(transactions));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionUpdateRequest request) {
        User user = authHelper.getCurrentUserOrThrow();
        
        Optional<Transaction> optTransaction = transactionRepository.findById(id);
        if (optTransaction.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found");
        }
        
        Transaction transaction = optTransaction.get();
        Account account = transaction.getAccount();
        
        if (!account.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Transaction does not belong to user");
        }
        
        Optional<TransactionType> optTransType = transactionTypeRepository.findTopByName(request.getTransactionType());
        if (optTransType.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid transaction type");
        }
        
        transactionService.updateTransaction(id, optTransType.get(), request.getAmount(), 
            request.getDescription(), request.getTransactionDate());
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(@PathVariable Long id) {
        User user = authHelper.getCurrentUserOrThrow();
        
        Optional<Transaction> optTransaction = transactionRepository.findById(id);
        if (optTransaction.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found");
        }
        
        Transaction transaction = optTransaction.get();
        Account account = transaction.getAccount();
        
        if (!account.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Transaction does not belong to user");
        }
        
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
