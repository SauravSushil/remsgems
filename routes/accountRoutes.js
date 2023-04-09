const router = require('express').Router();
const User = require('../models/user')

const validity = 9000000

router.route("/")
    .get((req, res) => {
        let cookies = req.cookies
        if (cookies.authStatus == "loggedIN") {
            User.findOne({ username: cookies.username })
                .then((user) => {
                    if (user) {
                        res.render('account', { user: user })
                    }
                })
                .catch((err) => {
                    res.render('authForm')
                })
        } else {
            res.render('authForm')
        }
    })
    .post((req, res) => {
        let username = req.body.username
        let password = req.body.password
        User.findOne({ username: username, password: password })
            .then((user) => {
                if (user) {
                    res.cookie('authStatus', 'loggedIN', { expires: new Date(Date.now() + validity) })
                    res.cookie('username', username, { expires: new Date(Date.now() + validity) })
                    res.render('account', { user: user })
                }
                else
                    res.render('authForm', { error: "Invalid username or password" })
            })
            .catch((err) => {
                res.render('authForm', { error: "Invalid username or password" })
            })
    })

router.post('/create', (req, res) => {
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let address = req.body.address


    const newUser = new User({
        username,
        email,
        password,
        address
    })
    newUser.save()

    res.cookie('username', username, { expires: new Date(Date.now() + validity) })
    res.cookie('authStatus', 'loggedIN', { expires: new Date(Date.now() + validity) })
    res.json({ status: "success" }).status(200)
})

router.post('/reset-password/:username', (req, res) => {
    User.findOne({ username: req.params.username })
        .then(user => {
            if (user) {
                user.password = req.body.password
                user.save()
                res.json({ success: true }).status(200)
            }
            else {
                res.json({ success: false, message: "Error" }).status(404)
            }
        })
})

module.exports = router;