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
        .then(({ rows: codes }) => {
            let match = false;
            for (let i = 0; i < codes.length; i++) {
                if (typedCode === codes[i].code) {
                    match = true;
                    hash(typedPw)
                        .then((hashedPw) => {
                            db.updatePw(email, hashedPw)
                                .then(() => {
                                    res.json({ success: true });
                                })
                                .catch((err) => {
                                    console.error(
                                        "error in db.updatePw: ",
                                        err
                                    );
                                    res.json({ success: false });
                                });
                        })
                        .catch((err) => {
                            console.error("error in hash: ", err);
                            res.json({ success: false });
                        });
                }
            }
            if (!match) {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.error("error in db.didCodeExpire: ", err);
            res.json({ success: false });
        });
});

app.get("/profile-info", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            const {
                first,
                last,
                email,
                created_at,
                profile_pic,
                bio,
            } = rows[0];
            res.json({
                id: req.session.userId,
                first: first,
                last: last,
                email: email,
                createdAt: created_at,
                profilePic: profile_pic,
                bio: bio,
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

app.get("/other-profile-info/:id", (req, res) => {
    const { id } = req.params;
    if (id == req.session.userId) {
        res.json({ sameUserOrNonExistingUser: true });
    } else {
        db.getOtherUserInfo(id)
            .then(({ rows }) => {
                if (rows.length == 0) {
                    res.json({ sameUserOrNonExistingUser: true });
                } else {
                    const {
                        first,
                        last,
                        email,
                        created_at,
                        profile_pic,
                        bio,
                    } = rows[0];
                    res.json({
                        id: id,
                        first: first,
                        last: last,
                        email: email,
                        createdAt: created_at,
                        profilePic: profile_pic,
                        bio: bio,
                    });
                }
            })
            .catch((err) => {
                console.error("error in db.getOtherUserInfo: ", err);
            });
    }
});

app.get("/last-registered", (req, res) => {
    db.lastRegistered()
        .then(({ rows: lastRegisteredArray }) => {
            res.json({ lastRegisteredArray: lastRegisteredArray });
        })
        .catch((err) => {
            console.error("error in db.lastRegistered: ", err);
        });
});

app.get("/find-user/:name", (req, res) => {
    const { name } = req.params;
    const first = name.split(" ")[0];
    const last = name.split(" ")[1] || "";
    db.getUsersByName(first, last)
        .then(({ rows: usersSearchResults }) => {
            res.json({ usersSearchResults: usersSearchResults });
        })
        .catch((err) => {
            console.error("error in db.lastRegistered: ", err);
        });
});

app.get("/friendship-status/:id", (req, res) => {
    const { id: otherUserId } = req.params;
    db.checkFriendshipStatus(req.session.userId, otherUserId)
        .then(({ rows: status }) => {
            if (status.length == 0) {
                res.json({ friends: false });
            } else if (status[0].accepted) {
                res.json({ friends: true });
            } else if (!status[0].accepted) {
                let sender = false;
                if (req.session.userId == status[0].sender_id) {
                    sender = true;
                }
                res.json({ requestSent: true, sender: sender });
            }
        })
        .catch((err) => {
            console.error("error in db.checkFriendshipStatus: ", err);
        });
});

app.post("/friendship-action", (req, res) => {
    const BUTTON_TEXT = {
        MAKE_REQUEST: "Make Request",
        CNCL_REQUEST: "Cancel Request",
        ACCPT_REQUEST: "Accept Request",
        UNFRIEND: "Unfriend",
    };

    const { action, otherUserId } = req.body;

    if (action == BUTTON_TEXT.MAKE_REQUEST) {
        db.makeFriendshipRequest(req.session.userId, otherUserId)
            .then(() => {
                res.json({ changeBtnTextTo: BUTTON_TEXT.CNCL_REQUEST });
            })
            .catch((err) => {
                console.error("error in db.makeFriendshipRequest: ", err);
            });
    } else if (action == BUTTON_TEXT.CNCL_REQUEST) {
        db.cancelFriendshipRequest(req.session.userId, otherUserId)
            .then(() => {
                res.json({ changeBtnTextTo: BUTTON_TEXT.MAKE_REQUEST });
            })
            .catch((err) => {
                console.error("error in db.cancelFriendshipRequest: ", err);
            });
    } else if (action == BUTTON_TEXT.ACCPT_REQUEST) {
        db.acceptFriendshipRequest(req.session.userId, otherUserId)
            .then(() => {
                res.json({ changeBtnTextTo: BUTTON_TEXT.UNFRIEND });
            })
            .catch((err) => {
                console.error("error in db.acceptFriendshipRequest: ", err);
            });
    } else if (action == BUTTON_TEXT.UNFRIEND) {
        db.unfriend(req.session.userId, otherUserId)
            .then(() => {
                res.json({ changeBtnTextTo: BUTTON_TEXT.MAKE_REQUEST });
            })
            .catch((err) => {
                console.error("error in db.unfriend: ", err);
            });
    }
});

app.get("/friends-list", (req, res) => {
    db.getFriendsList(req.session.userId)
        .then(({ rows: friendsList }) => {
            res.json({ friendsList });
        })
        .catch((err) => {
            console.error("error in db.getFriendsList: ", err);
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
