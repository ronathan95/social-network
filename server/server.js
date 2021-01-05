const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("../db");
const { hash, compare } = require("../bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");

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

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

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
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.error("error in db.addNewUser: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.error("error in hash: ", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    const { email, pw: typedPw } = req.body;
    db.getHashedPwAndUserId(email)
        .then(({ rows }) => {
            const { password: hashedPw, id: userId } = rows[0];
            compare(typedPw, hashedPw)
                .then((result) => {
                    if (result) {
                        req.session.userId = userId;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.error("error in compare: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            "error in db.getHashedPwandUserId", err;
            res.json({ success: false });
        });
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    db.doesEmailExists(email)
        .then(({ rows }) => {
            if (rows.length <= 0) {
                res.json({ success: false });
            } else {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.addNewResetCode(email, secretCode)
                    .then(() => {
                        sendEmail(
                            email,
                            `This is your verfication code: ${secretCode}`,
                            "Social Network || Reset Password"
                        )
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.error(
                                    "error in sendEmail for reset password: ",
                                    err
                                );
                                res.json({ success: false });
                            });
                    })
                    .catch((err) => {
                        console.error("error in db.addNewResetCode: ", err);
                        res.json({ success: false });
                    });
            }
        })
        .catch((err) => {
            console.error("error in db.doesEmailExists: ", err);
            res.json({ success: false });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { email, code, pw: typedPw } = req.body;
    db.didCodeExpire(email)
        .then(() => {})
        .catch((err) => {
            console.error("error in db.didCodeExpire: ", err);
            res.json({ success: false });
        });
});

app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
