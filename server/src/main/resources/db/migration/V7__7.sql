ALTER TABLE category
    ADD COLUMN user_id BIGINT NOT NULL
        REFERENCES "user"(id);

ALTER TABLE transaction
    ADD COLUMN user_id BIGINT NOT NULL
        REFERENCES "user"(id);
