const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const User = require('./models/user')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ['*']
}))
app.set('view engine', 'ejs')

try {
    mongoose.connect('mongodb://localhost:27017/cssDB', { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("Connected to DB");
} catch (error) {
    console.log(error)
}


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/products', (req, res) => {
    res.render('products')
})


app.route('/account')
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
                    res.cookie('authStatus', 'loggedIN', { expires: new Date(Date.now() + 900000) })
                    res.cookie('username', username, { expires: new Date(Date.now() + 900000) })
                    res.render('account', { user: user })
                }
                else
                    res.render('authForm', { error: "Invalid username or password" })
            })
            .catch((err) => {
                res.render('authForm', { error: "Invalid username or password" })
            })
    })

app.post('/account/create', (req, res) => {
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

    res.cookie('username', username, { expires: new Date(Date.now() + 900000) })
    res.cookie('authStatus', 'loggedIN', { expires: new Date(Date.now() + 900000) })
    res.json({ status: "success" }).status(200)
})

app.post('/account/reset-password/:username', (req, res) => {
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))