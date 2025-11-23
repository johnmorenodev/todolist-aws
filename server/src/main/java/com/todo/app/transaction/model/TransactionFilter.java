package com.todo.app.transaction.model;

import java.time.LocalDateTime;

public record TransactionFilter(
    String search,
    LocalDateTime startDate,
    LocalDateTime endDate,
    String transactionType
) {
    public boolean hasSearch() {
        return search != null && !search.trim().isEmpty();
    }

    public boolean hasDateRange() {
        return startDate != null || endDate != null;
    }

    public boolean hasTransactionType() {
        return transactionType != null && !transactionType.trim().isEmpty() && !transactionType.equals("all");
    }

    public boolean hasAnyFilter() {
        return hasSearch() || hasDateRange() || hasTransactionType();
    }
}

