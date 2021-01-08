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
