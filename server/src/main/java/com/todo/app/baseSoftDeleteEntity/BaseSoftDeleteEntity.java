package com.todo.app.baseSoftDeleteEntity;

import java.time.LocalDateTime;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
@FilterDef(name = "softDeleteFilter", parameters = @ParamDef(name = "isDeleted", type = Boolean.class))
@Filter(name = "softDeleteFilter", condition = "deleted_at IS NULL")
public abstract class BaseSoftDeleteEntity {

    @Column(name = "deleted_at")
    protected LocalDateTime deletedAt;
}
