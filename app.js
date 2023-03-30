const express = require('express')
const ejs = require('ejs')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/products', (req, res) => {
    res.render('products')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))