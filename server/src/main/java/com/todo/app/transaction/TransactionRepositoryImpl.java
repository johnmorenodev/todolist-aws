package com.todo.app.transaction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.todo.app.account.Account;
import com.todo.app.transaction.model.TransactionFilter;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class TransactionRepositoryImpl implements TransactionRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Transaction> findByAccountWithFilters(Account account, TransactionFilter filter, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Transaction> query = cb.createQuery(Transaction.class);
        Root<Transaction> root = query.from(Transaction.class);

        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.equal(root.get("account"), account));
        
        predicates.add(cb.isNull(root.get("deletedAt")));

        if (filter.hasSearch()) {
            String searchPattern = "%" + filter.search().toLowerCase() + "%";
            predicates.add(
                cb.like(
                    cb.lower(root.get("description")),
                    searchPattern
                )
            );
        }

        if (filter.hasDateRange()) {
            if (filter.startDate() != null) {
                Predicate datePredicate = cb.or(
                    cb.and(
                        root.get("transactionDate").isNotNull(),
                        cb.greaterThanOrEqualTo(root.get("transactionDate"), filter.startDate())
                    ),
                    cb.and(
                        root.get("transactionDate").isNull(),
                        cb.greaterThanOrEqualTo(root.get("createdAt"), filter.startDate())
                    )
                );
                predicates.add(datePredicate);
            }

            if (filter.endDate() != null) {
                Predicate datePredicate = cb.or(
                    cb.and(
                        root.get("transactionDate").isNotNull(),
                        cb.lessThanOrEqualTo(root.get("transactionDate"), filter.endDate())
                    ),
                    cb.and(
                        root.get("transactionDate").isNull(),
                        cb.lessThanOrEqualTo(root.get("createdAt"), filter.endDate())
                    )
                );
                predicates.add(datePredicate);
            }
        }

        if (filter.hasTransactionType()) {
            predicates.add(
                cb.equal(
                    root.get("transactionType").get("name"),
                    filter.transactionType()
                )
            );
        }

        query.where(predicates.toArray(new Predicate[0]));

        Sort sort = pageable.getSort();
        if (sort.isSorted()) {
            List<jakarta.persistence.criteria.Order> orders = new ArrayList<>();
            sort.forEach(order -> {
                if (order.getProperty().equals("date")) {
                    jakarta.persistence.criteria.Expression<LocalDateTime> dateExpr = cb.coalesce(
                        root.get("transactionDate").as(LocalDateTime.class),
                        root.get("createdAt").as(LocalDateTime.class)
                    );
                    if (order.isAscending()) {
                        orders.add(cb.asc(dateExpr));
                    } else {
                        orders.add(cb.desc(dateExpr));
                    }
                } else {
                    if (order.isAscending()) {
                        orders.add(cb.asc(root.get(order.getProperty())));
                    } else {
                        orders.add(cb.desc(root.get(order.getProperty())));
                    }
                }
            });
            query.orderBy(orders);
        } else {
            jakarta.persistence.criteria.Expression<LocalDateTime> dateExpr = cb.coalesce(
                root.get("transactionDate").as(LocalDateTime.class),
                root.get("createdAt").as(LocalDateTime.class)
            );
            query.orderBy(cb.desc(dateExpr));
        }

        TypedQuery<Transaction> typedQuery = entityManager.createQuery(query);
        
        if (pageable.isPaged()) {
            typedQuery.setFirstResult((int) pageable.getOffset());
            typedQuery.setMaxResults(pageable.getPageSize());
        }

        return typedQuery.getResultList();
    }
}

