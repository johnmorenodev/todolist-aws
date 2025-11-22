CREATE TABLE IF NOT EXISTS transaction_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO transaction_type (id, name)
VALUES (1, 'expense'), (2, 'income');

CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    amount NUMERIC(12, 2),
    transaction_type INTEGER NOT NULL REFERENCES transaction_type(id),
    description VARCHAR(255),
    notes TEXT,
    category_id INTEGER REFERENCES category(id)
);
