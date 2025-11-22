package com.todo.app.account;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.todo.app.transactionType.TransactionTypeConstants;
import com.todo.app.user.User;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findAllByUser(User user);

    Optional<Account> findTopById(Integer id);
}
