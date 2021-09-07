const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const user = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    console.log("hi..");
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created!',
                        result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })
});

router.post("/login", (req, res, next) => {
    let fetchUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "User doesn't exist"
                })
            }
            fetchUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            const token = jwt.sign(
                { email: fetchUser.email, userId: fetchUser._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token,
                expiresIn: 3600,
                userId: fetchUser._id
            });
        })
        .catch(err => {
            console.log("error", err)
            return res.status(401).json({
                message: "Auth failed"
            })
        })
})

module.exports = router;