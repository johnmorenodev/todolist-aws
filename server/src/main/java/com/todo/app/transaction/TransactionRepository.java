package com.todo.app.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    List<Transaction> findByAccountOrderByCreatedAtDesc(Account account, Pageable pageable);

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.account = :account
              AND (:search IS NULL OR :search = '' OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY t.createdAt DESC
            """)
    List<Transaction> findByAccountAndDescriptionContainingIgnoreCase(Account account, String search, Pageable pageable);

    @Query(value = """
            SELECT t.* FROM transaction t
            JOIN transaction_type tt ON tt.id = t.transaction_type
            WHERE t.account_id = :accountId
              AND (:search = '' OR LOWER(t.description) LIKE LOWER('%' || :search || '%'))
              AND (:startDate = CAST('1970-01-01 00:00:00' AS TIMESTAMP) OR COALESCE(t.transaction_date, t.created_at) >= :startDate)
              AND (:endDate = CAST('9999-12-31 23:59:59' AS TIMESTAMP) OR COALESCE(t.transaction_date, t.created_at) <= :endDate)
              AND (:transactionType = '' OR tt.name = :transactionType)
            ORDER BY COALESCE(t.transaction_date, t.created_at) DESC
            LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    List<Transaction> findByAccountWithFilters(
        @Param("accountId") Long accountId,
        @Param("search") String search, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate, 
        @Param("transactionType") String transactionType,
        @Param("limit") int limit,
        @Param("offset") int offset
    );

}
