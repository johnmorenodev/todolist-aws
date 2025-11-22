ALTER TABLE category
    ADD COLUMN user_id BIGINT NOT NULL
        REFERENCES users(id);

ALTER TABLE transaction
    ADD COLUMN user_id BIGINT NOT NULL
        REFERENCES users(id);
