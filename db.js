const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.addNewUser = (first, last, email, pw) => {
    const q =
        "INSERT INTO users (first,last,email,password) VALUES ($1, $2, $3, $4) RETURNING id";
    const params = [first, last, email, pw];
    return db.query(q, params);
};

module.exports.getHashedPwAndUserId = (email) => {
    const q = "SELECT password, id FROM users WHERE email = ($1)";
    const params = [email];
    return db.query(q, params);
};

module.exports.doesEmailExists = (email) => {
    const q = "SELECT * FROM users WHERE email = ($1)";
    const params = [email];
    return db.query(q, params);
};

module.exports.addNewResetCode = (email, code) => {
    const q = "INSERT INTO reset_codes (email, code) VALUES ($1, $2)";
    const params = [email, code];
    return db.query(q, params);
};

module.exports.didCodeExpire = (email) => {
    const q =
        "SELECT code FROM reset_codes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND email = ($1);";
    const params = [email];
    return db.query(q, params);
};

module.exports.updatePw = (email, newPw) => {
    const q = "UPDATE users SET password = ($2) WHERE email = ($1)";
    const params = [email, newPw];
    return db.query(q, params);
};

module.exports.getUserInfo = (userId) => {
    const q =
        "SELECT first, last, email, created_at, profile_pic, bio FROM users WHERE id = ($1)";
    const params = [userId];
    return db.query(q, params);
};

module.exports.updateProfilePic = (userId, url) => {
    const q = "UPDATE users SET profile_pic = ($2) WHERE id = ($1)";
    const params = [userId, url];
    return db.query(q, params);
};

module.exports.updateBio = (userId, bio) => {
    const q = "UPDATE users SET bio = ($2) WHERE id = ($1)";
    const params = [userId, bio];
    return db.query(q, params);
};

module.exports.getOtherUserInfo = (userId) => {
    const q =
        "SELECT first, last, email, created_at, profile_pic, bio FROM users WHERE id = ($1)";
    const params = [userId];
    return db.query(q, params);
};

module.exports.lastRegistered = () => {
    return db.query("SELECT * FROM users ORDER BY id DESC LIMIT 3");
};

module.exports.getUsersByName = (first, last) => {
    return db.query(
        "SELECT * FROM users WHERE first ILIKE $1 AND last ILIKE $2;",
        [first + "%", last + "%"]
    );
};

module.exports.checkFriendshipStatus = (userId, otherUserId) => {
    const q =
        "SELECT * FROM friendships WHERE (sender_id = ($1) AND recipient_id = ($2)) OR (sender_id = ($2) AND recipient_id = ($1))";
    const params = [userId, otherUserId];
    return db.query(q, params);
};

module.exports.makeFriendshipRequest = (userId, otherUserId) => {
    const q =
        "INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES (($1), ($2), 'false')";
    const params = [userId, otherUserId];
    return db.query(q, params);
};

module.exports.cancelFriendshipRequest = (userId, otherUserId) => {
    const q =
        "DELETE FROM friendships WHERE recipient_id = ($1) AND recipient_id = ($2)";
    const params = [userId, otherUserId];
    return db.query(q, params);
};

module.exports.acceptFriendshipRequest = (userId, otherUserId) => {
    const q =
        "UPDATE friendships SET accepted = 'true' WHERE recipient_id = ($2) AND recipient_id = ($1)";
    const params = [userId, otherUserId];
    return db.query(q, params);
};

module.exports.unfriend = (userId, otherUserId) => {
    const q =
        "DELETE FROM friendships WHERE (sender_id = ($1) AND recipient_id = ($2)) OR (sender_id = ($2) AND recipient_id = ($1))";
    const params = [userId, otherUserId];
    return db.query(q, params);
};

module.exports.getFriendsList = (userId) => {
    const q =
        "SELECT users.id, users.first, users.last, users.profile_pic, friendships.accepted " +
        "FROM friendships " +
        "JOIN users " +
        "ON (friendships.accepted = false AND friendships.recipient_id = $1 AND friendships.sender_id = users.id) " +
        "OR (friendships.accepted = true AND friendships.recipient_id = $1 AND friendships.sender_id = users.id) " +
        "OR (friendships.accepted = true AND friendships.sender_id = $1 AND friendships.recipient_id = users.id)";
    const params = [userId];
    return db.query(q, params);
};

module.exports.getTenMostRecentMessages = () => {
    const q =
        "SELECT chat_messages.id, chat_messages.message, chat_messages.created_at, users.profile_pic, users.first, users.last " +
        "FROM chat_messages " +
        "JOIN users " +
        "ON chat_messages.user_id = users.id " +
        "LIMIT 10";
    return db.query(q);
};

module.exports.addNewMessage = (userId, message) => {
    const q =
        "INSERT INTO chat_messages (user_id, message) VALUES ($1, $2) RETURNING id, created_at";
    const params = [userId, message];
    return db.query(q, params);
};

deleteUserFromUsers = (userId) => {
    const q = "DELETE FROM users WHERE id = ($1)";
    const params = [userId];
    return db.query(q, params);
};

// update to reset_codes table is needed: adding user_id column

// deleteUserFromResetCodes = (userId) => {
//     const q = "DELETE FROM reset_codes WHERE user_id = ($1)";
//     const params = [userId];
//     return db.query(q, params);
// };

deleteUserFromFriendships = (userId) => {
    const q =
        "DELETE FROM friendships WHERE sender_id = ($1) OR recipient_id = ($1)";
    const params = [userId];
    return db.query(q, params);
};

deleteUserFromChatMessages = (userId) => {
    const q = "DELETE FROM chat_messages WHERE user_id = ($1)";
    const params = [userId];
    return db.query(q, params);
};

module.exports.deleteUser = (userId) => {
    Promise.all([
        deleteUserFromUsers(userId),
        deleteUserFromResetCodes(userId),
        deleteUserFromFriendships(userId),
        deleteUserFromChatMessages(userId),
    ])
        .then(() => {
            console.log(`user with id ${userId} deleted his account`);
        })
        .catch((err) => {
            console.error("error in db.deleteUser: ", err);
        });
};
