package com.todo.app.account;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.todo.app.account.models.AccountListItem;
import com.todo.app.account.models.AccountSummary;
import com.todo.app.transaction.TransactionRepository;
import com.todo.app.user.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public List<AccountListItem> getAccountListForUser(User user) {
        List<Account> accounts = accountRepository.findAllByUser(user);

        return accounts.stream()
                .map(account -> {
                    AccountListItem item = new AccountListItem();
                    item.setAccountId(account.getId());
                    item.setName(account.getName());
                    
                    BigDecimal income = transactionRepository.getTotalIncomeForAccount(account);
                    BigDecimal expense = transactionRepository.getTotalExpenseForAccount(account);
                    BigDecimal balance = income.subtract(expense);
                    item.setBalance(balance);
                    
                    return item;
                })
                .toList();
    }

    public AccountSummary getAccountSummary(Long accountId) {
        Optional<Account> optAccount = accountRepository.findTopById(accountId.intValue());
        if (optAccount.isEmpty()) {
            throw new IllegalArgumentException("Account not found: " + accountId);
        }
        
        Account account = optAccount.get();
        AccountSummary summary = new AccountSummary();
        summary.setAccountId(account.getId());
        summary.setName(account.getName());
        summary.setIncome(transactionRepository.getTotalIncomeForAccount(account));
        summary.setExpense(transactionRepository.getTotalExpenseForAccount(account));
        
        BigDecimal balance = summary.getIncome().subtract(summary.getExpense());
        summary.setBalance(balance);
        
        return summary;
    }

    public Account createNewAccount(User user, String name) {
        Account account = new Account();
        account.setUser(user);
        account.setName(name);
        Account savedAccount = accountRepository.save(account);
        return savedAccount;
    }

}
