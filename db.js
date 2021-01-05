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
