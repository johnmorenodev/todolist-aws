-- Rename table
ALTER TABLE transactions RENAME TO transaction;

-- Make amount NOT NULL
ALTER TABLE transaction
    ALTER COLUMN amount SET NOT NULL;


-- Add timestamps to category
ALTER TABLE category
    ADD COLUMN created_at TIMESTAMP DEFAULT NOW(),
    ADD COLUMN updated_at TIMESTAMP DEFAULT NOW(),
    ADD COLUMN deleted_at TIMESTAMP NULL;

-- Add timestamps to transaction table
ALTER TABLE transaction
    ADD COLUMN created_at TIMESTAMP DEFAULT NOW(),
    ADD COLUMN updated_at TIMESTAMP DEFAULT NOW(),
    ADD COLUMN deleted_at TIMESTAMP NULL;
