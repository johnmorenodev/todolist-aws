CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES "user"(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);


ALTER TABLE transaction
    DROP COLUMN IF EXISTS user_id;

ALTER TABLE transaction
    ADD COLUMN account_id BIGINT NOT NULL
        REFERENCES account(id);
