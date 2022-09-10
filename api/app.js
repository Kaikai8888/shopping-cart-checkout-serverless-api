const serverless = require('serverless-http')
const express = require('express')
const app = express()
const passport = require('./passport')
const settings = require('./settings')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())

function authenticate(req, res, next) {
    return passport.authenticate('jwt', { session: false })(req, res, next)
}

app.get('/', function (req, res) {
    res.send('This is shopping cart checkout API endpoint.')
})

app.post('/api/authenticate', function (req, res) {
    let payload = {
        id: 1,
        name: 'test'
    }
    const token = jwt.sign(payload, settings.jwt_secret, { expiresIn: '7d' })
    res.json({ status: 'success', token })
})

app.post('/api/user', authenticate, function (req, res) {
    res.send('post USER!')
})

app.delete('/api/user/:id', authenticate, function (req, res) {
})

app.post('/api/product', authenticate, function() {})
app.delete('/api/product/:id', authenticate, function () { })

app.post('/api/order', authenticate, function () { })
app.get('/api/order', authenticate, function () { })


exports.lambdaHandler = serverless(app);