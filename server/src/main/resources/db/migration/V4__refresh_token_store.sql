CREATE TABLE IF NOT EXISTS refresh_token_store (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(191) NOT NULL UNIQUE,
    jti VARCHAR(191) NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_refresh_username ON refresh_token_store(username);


