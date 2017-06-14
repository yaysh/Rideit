var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var db = mongojs("mongodb://localhost:27017/rideit", ["users"]);

//mötasplats, tid, email, namn, tlfnr, isdriver

router.post("/ad", (req, res, next) => {
    const ad = req.body;
    db.ads.save(ad, (err, result) => {
        if (err) {
            res.json({ "error": "error inside create ad" });
        }

        res.json({
            success: true
        });
    });
})

router.get("/ad", (req, res, next) => {
    const user_id = req.query.creator_id;
    if (user_id != null) {
        db.ads.find({ creator_id: user_id }, (err, ads) => {
            if (err) {
                res.json({
                    error: "db error"
                });
            } else if (ads) {
                res.json({
                    ads
                });
            } else {
                res.json({
                    error: "there are not ads"
                });
            }
        });
    } else {
        db.ads.find((err, ads) => {
            if (err) {
                res.json({
                    error: "db error"
                });
            } else if (ads) {
                res.json({
                    ads
                });
            } else {
                res.json({
                    error: "there are not ads"
                });
            }
        });
    }


});


/* 
    get all users
*/
router.get("/", (req, res, next) => {
    db.users.find((err, users) => {
        if (err) {
            res.json({
                "error": err
            })
        } else {
            res.json(users);
        }
    })
});

router.put("/", (req, res, next) => {
    const user_id = mongojs.ObjectId(req.body._id);
    const email = req.body.email;
    const password = req.body.password;
    findUserByID(user_id).then((oldUser) => {

        if (oldUser) {
            var oldEmail = oldUser.email;
            var oldPassword = oldUser.password;
            if (email.length > 0) {
                oldEmail = email;
            }
            if (password.length > 0)  {
                oldPassword = password;
            }
            db.users.update({ "_id": user_id }, {
                email: oldEmail,
                password: oldPassword
            }, (err, user) => {
                if (user) {

                    res.json({
                        success: "true"
                    });
                } else {
                    res.json({
                        success: "false"
                    });
                }
            })
        }
    });


});
/* 
    Login a user 
*/
router.post("/login", (req, res, next) => {

    const user = req.body;

    db.users.findOne({
        email: user.email,
        password: user.password
    }, (err, user) =>  {
        if (err) {
            res.json({
                error: "error"
            })
        } else if (user) {
            res.json({
                user
            });
        } else {
            res.json({
                error: "username or password wrong"
            });
        }
    });
})



/* 
    create user 
*/

//name string, email string, password string, phone string, isdriver bool
router.post("/", (req, res, next) => {
    const user = req.body;
    const name = user.name;
    const email = user.email;
    const password = user.password;
    const phone = user.phone;
    const isDriver = user.isDriver;

    if (!user.email) {
        res.status(400);
        res.json({
            "error": "You need to choose a username"
        });
    } else {
        userExists(res, user).then((doesExist) => {
            if (!doesExist) {
                createUser(res, user);
            } else {
                res.json({ "error": "extremely wierd error@post create user" });
            }
        }).catch((reason) => {
            console.log("Handle rejected promise (" + reason + ") here.");
        });
    }
});

/*
    The following two functions are helper functions for creating the account
    We need to create an async request that checks if the user exists in the DB
    and if he doesn"t we want to add the user to the db and send a confirmation
    that the user was created
*/
function createUser(res, user) {
    db.users.save(user, (err, user) => {
        if (err) {
            res.json({ "error": "error inside users.save" });
        }

        res.json({
            user
        });
    });
}

function userExists(res, user) {
    return new Promise(
        (resolve, reject) => {
            db.users.findOne({
                email: user.email
            }, (err, user) => {
                if (err) {
                    res.json({
                        error: "userExists error"
                    });
                } else {
                    if (user) {
                        res.json({
                            error: "user already exists"
                        });
                    } else {
                        resolve(false);
                    }
                }
            });
        }
    );
}
/*
    Create user functions end here
*/

function findUserByID(user_id) {
    return new Promise(
        (resolve, reject) => {
            db.users.findOne({
                _id: user_id
            }, (err, user) => {
                if (user) {
                    resolve(user);
                }
            });
        }
    );
}
/* 
    delete a single user based on the user ID found in the mongodb 
    fix some security around this one lads
 */
router.delete("/:id", (req, res, next) => {
    console.log("hello");
    db.users.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, (err, user) => {
        if (err) {

            res.json({
                error: err
            })
        } else {
            res.json(user);
        }
    });
});

module.exports = router;