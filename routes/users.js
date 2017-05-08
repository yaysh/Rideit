var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var db = mongojs("mongodb://localhost:27017/rideit", ["users"]);



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



/* 
    Login a user 
*/
router.post("/login", (req, res, next) => {
    const user = req.body;
    db.users.findOne({ "username": user.username, "password": user.password }, (err, user) =>  {
        if (err) {
            res.json({
                error: "error"
            })
        } else if (user) {
            res.json({
                success: user
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
router.post("/", (req, res, next) => {
    const user = req.body;
    console.log("got the request")
    console.log(user);
    if (!user.username) {
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
        console.log(user);
        res.json(user);
    });
}

function userExists(res, user) {
    return new Promise(
        (resolve, reject) => {
            db.users.findOne({ username: user.username }, (err, user) => {
                if (err) {
                    res.json({ "error": "userExists error" });
                } else {
                    if (user) {
                        res.json({ "error": "user already exists" });
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


/* 
    delete a single user based on the user ID found in the mongodb 
    fix some security around this one lads
 */
router.delete("/:id", (req, res, next) => {
    db.users.remove({ _id: mongojs.ObjectId(req.params.id) }, (err, user) => {
        if (err) {
            console.log("error")
            res.json({
                "error": err
            })
        } else {
            res.json(user);
        }
    });
});

module.exports = router;
