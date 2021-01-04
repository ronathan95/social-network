const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("../db");
const { hash, compare } = require("../bc");

///////////////////////////////////////////////

app.use(compression());

app.use(
    express.json({
        extended: false,
    })
);

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(express.static(path.join(__dirname, "..", "client", "public")));

///////////////////////////////////////////////

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    const { first, last, email, pw } = req.body;
    hash(pw)
        .then((hashedPw) => {
            db.addNewUser(first, last, email, hashedPw)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                })
                .catch((err) => {
                    console.error("error in db.addNewUser: ", err);
                });
        })
        .catch((err) => {
            console.error("error in hash: ", err);
        });
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
