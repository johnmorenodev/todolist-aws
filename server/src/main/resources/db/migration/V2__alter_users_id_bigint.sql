-- Convert users.id to BIGINT to match JPA @Id Long
ALTER TABLE users
  ALTER COLUMN id TYPE BIGINT;

