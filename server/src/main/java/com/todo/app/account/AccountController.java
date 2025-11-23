package com.todo.app.account;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.todo.app.account.models.AccountListItem;
import com.todo.app.account.models.AccountSummary;
import com.todo.app.account.models.CreateAccountRequest;
import com.todo.app.auth.AuthHelper;
import com.todo.app.common.response.ApiResponse;
import com.todo.app.user.User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final AuthHelper authHelper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountListItem>>> getAccountList() {
        User user = authHelper.getCurrentUserOrThrow();
        List<AccountListItem> result = accountService.getAccountListForUser(user);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<ApiResponse<AccountSummary>> getAccountSummary(@PathVariable Long id) {
        try {
            AccountSummary summary = accountService.getAccountSummary(id);
            return ResponseEntity.ok(ApiResponse.ok(summary));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        User user = authHelper.getCurrentUserOrThrow();
        accountService.createNewAccount(user, request.getName());
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
