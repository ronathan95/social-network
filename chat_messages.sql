 DROP TABLE IF EXISTS chat_messages;
 
 CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    message VARCHAR NOT NULL CHECK (message != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat_messages (user_id, message) VALUES ('1', 'hello everybody');
INSERT INTO chat_messages (user_id, message) VALUES ('94', 'heyyyyyy');
INSERT INTO chat_messages (user_id, message) VALUES ('87', 'is this working?');