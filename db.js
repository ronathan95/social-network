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
