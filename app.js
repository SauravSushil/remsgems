const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const accountRoutes = require('./routes/accountRoutes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cors())
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



app.use('/account', accountRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))