package com.todo.app.transaction;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.todo.app.account.Account;
import com.todo.app.transactionType.TransactionTypeConstants;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, TransactionRepositoryCustom {
    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.account = :account
              AND t.transactionType.id = """ + TransactionTypeConstants.TRANSACTION_TYPE_INCOME_ID)
    BigDecimal getTotalIncomeForAccount(Account account);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.account = :account
              AND t.transactionType.id = """ + TransactionTypeConstants.TRANSACTION_TYPE_EXPENSE_ID)
    BigDecimal getTotalExpenseForAccount(Account account);

}
