ALTER TABLE transaction
    ADD COLUMN transaction_date TIMESTAMP DEFAULT NOW();

