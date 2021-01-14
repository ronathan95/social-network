DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false
);

-- INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES ('1', '32', 'true');
-- INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES ('1', '67', 'false');
-- INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES ('172', '1', 'false');
-- INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES ('86', '1', 'true');