package com.todo.app.account;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.todo.app.account.models.AccountSummary;
import com.todo.app.transaction.TransactionRepository;
import com.todo.app.user.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public List<AccountSummary> getAccountSummaryForUser(User user) {
        List<Account> accounts = accountRepository.findAllByUser(user);

        return accounts.stream()
                .map(account -> {
                    AccountSummary summary = new AccountSummary();
                    summary.setName(account.getName());
                    summary.setExpense(transactionRepository.getTotalExpenseForAccount(account));
                    summary.setIncome(transactionRepository.getTotalIncomeForAccount(account));

                    BigDecimal balance = summary.getIncome().subtract(summary.getExpense());
                    summary.setBalance(balance);
                    summary.setAccountId(account.getId());
                    return summary;
                })
                .toList();
    }

    public Account createNewAccount(User user, String name) {
        Account account = new Account();
        account.setUser(user);
        account.setName(name);
        Account savedAccount = accountRepository.save(account);
        return savedAccount;
    }

}
