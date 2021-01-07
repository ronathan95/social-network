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
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

///////////////////////////////////////////////

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + "/uploads");
    },
    filename: (req, file, callback) => {
        uidSafe(24)
            .then((uid) => {
                callback(null, `${uid}${path.extname(file.originalname)}`);
            })
            .catch((err) => {
                callback(err);
            });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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
    const { email, code: typedCode, pw: typedPw } = req.body;
    db.didCodeExpire(email)
        .then(({ rows }) => {
            const codes = rows[0];
            console.log("codes: ", codes);
            let match = false;
            for (let i = 0; i < codes.length; i++) {
                console.log("codes[i].code: ", codes[i].code);
                if (typedCode === codes[i].code) {
                    match = true;
                    hash(typedPw)
                        .then((hashedPw) => {
                            db.updatePw(req.session.userId, hashedPw)
                                .then(() => {
                                    res.json({ success: true });
                                })
                                .catch((err) => {
                                    console.error(
                                        "error in db.updatePw: ",
                                        err
                                    );
                                });
                        })
                        .catch((err) => {
                            console.error("error in hash: ", err);
                        });
                }
            }
            // if (!match) {
            //     res.json({ success: false });
            // }
        })
        .catch((err) => {
            console.error("error in db.didCodeExpire: ", err);
            res.json({ success: false });
        });
});

app.get("/profile-info", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            const { first, last, email, created_at, profile_pic } = rows[0];
            res.json({
                id: req.session.userId,
                first: first,
                last: last,
                email: email,
                createdAt: created_at,
                profilePic: profile_pic,
            });
        })
        .catch((err) => {
            console.error("error in db.getUserInfo: ", err);
            res.json({ success: false });
        });
});

app.post(
    "/update-profile-pic",
    uploader.single("image"),
    s3.upload,
    (req, res) => {
        if (req.file) {
            const url = s3Url + req.file.filename;
            db.updateProfilePic(req.session.userId, url)
                .then(() => {
                    res.json({ profilePic: url });
                })
                .catch((err) => {
                    console.error("error in db.updateProfilePic: ", err);
                });
        } else {
            res.json({ success: false });
        }
    }
);

app.post("/update-bio", (req, res) => {
    const { draftBio } = req.body;
    db.updateBio(req.session.userId, draftBio)
        .then(() => {
            res.json({ bio: draftBio });
        })
        .catch((err) => {
            console.error("error in db.updateBio: ", err);
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
