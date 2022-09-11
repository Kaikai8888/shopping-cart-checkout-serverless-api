const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { ApiUser } = require('../models');

async function authenticate(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await ApiUser.findOne({ email })
    if (!user) return res.status(403).json({ status: 'error', message: 'The email hasn\'t been registered' })
    if (!bcrypt.compareSync(password, user.password)) return res.status(403).json({ status: 'error', message: 'Wrong email or password.' })

    const payload = {
      id: user._id,
      name: user.name
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({ status: 'success', token })
  } catch (error) {
    next(error)
  }
}

module.exports = authenticate;