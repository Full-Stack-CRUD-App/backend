-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS full_stack_items CASCADE;

DROP TABLE IF EXISTS tasks;

DROP TABLE IF EXISTS full_stack_users CASCADE;

CREATE TABLE full_stack_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR,
  password_hash VARCHAR NOT NULL
);

CREATE TABLE full_stack_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT,
  bought BOOLEAN NOT NULL DEFAULT(FALSE),
  description VARCHAR,
  qty INT,
  FOREIGN KEY (user_id) REFERENCES full_stack_users(id)
);