const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { ApiUser } = require('../models')
const settings = require('../config/settings')

async function authenticate(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Missing email or password' })
    const user = await ApiUser.findOne({ email })
    if (!user) return res.status(403).json({ status: 'error', message: 'The email hasn\'t been registered' })
    if (!bcrypt.compareSync(password, user.password)) return res.status(403).json({ status: 'error', message: 'Wrong email or password.' })

    const payload = {
      id: user._id,
      name: user.name
    }
    const token = jwt.sign(payload, settings.jwt_secret, { expiresIn: '1d' })
    res.json({ status: 'success', token })
  } catch (error) {
    next(error)
  }
}

module.exports = authenticate;