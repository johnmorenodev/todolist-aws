package com.todo.app.transactionType;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionTypeRepository extends JpaRepository<TransactionType, Long> {

    Optional<TransactionType> findTopByName(String name);
}
