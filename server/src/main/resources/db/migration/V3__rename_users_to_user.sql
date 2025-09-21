-- Rename table users -> "user" (reserved word requires quotes)
ALTER TABLE users RENAME TO "user";

-- Ensure id is BIGINT after rename (in case V2 wasn't applied yet on some envs)
ALTER TABLE "user"
  ALTER COLUMN id TYPE BIGINT;

