package com.todo.app.account;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<ApiResponse<List<AccountSummary>>> getAccountList() {
        User user = authHelper.getCurrentUserOrThrow();
        List<AccountSummary> result = accountService.getAccountSummaryForUser(user);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        User user = authHelper.getCurrentUserOrThrow();
        accountService.createNewAccount(user, request.getName());
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
