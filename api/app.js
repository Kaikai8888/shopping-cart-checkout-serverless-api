const serverless = require('serverless-http')
const express = require('express')
const app = express()
const passport = require('./config/passport')
const bodyParser = require('body-parser')
const controller = require('./controller')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())

function authenticate(req, res, next) {
    return passport.authenticate('jwt', { session: false })(req, res, next)
}

app.get('/', function (req, res) {
    res.send('This is shopping cart checkout API endpoint.')
})

app.post('/api/authenticate', controller.authenticate)

app.post('/api/user', authenticate, controller.user.create)

app.delete('/api/user/:id', authenticate, controller.user.delete)

app.post('/api/product', authenticate, controller.product.create)
app.delete('/api/product/:id', authenticate, controller.product.delete)

app.post('/api/order', authenticate, controller.order.create)
app.get('/api/order', authenticate, controller.order.get)


exports.lambdaHandler = serverless(app)