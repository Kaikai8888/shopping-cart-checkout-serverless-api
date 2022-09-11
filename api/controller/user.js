const { User } = require('../models')
const bcrypt = require('bcryptjs')

module.exports = {
  async create(req, res, next) {
    try {
      let { name, email, password } = req.body
      if (!name || !email || !password) return res.status(400).json({ status: 'error', message: 'Missing name / email / password.'})
      let user = await User.findOne({ email })
      if (user) return res.status(400).json({ status: 'error', message: 'Email already registered' })
      user = await User.create({
        name, email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })
      return res.json({ status: 'success', result: { id: user._id } })
    } catch (err) {
      next(err)
    }
  },
  async delete(req, res, next) {
    try {
      let id = req.params.id
      if (!id) return res.status(400).json({ status: 'error', message: 'Missing user id.' })
      let user = await User.findById(id).populate('orders').lean()
      if (!user) return res.status(400).json({ status: 'error', message: 'User not found' })
      if (user.orders && user.orders.length) return res.status(400).json({ status: 'error', message: 'Cannot remove user who has ordered products.' })
      await User.deleteOne({ _id: id })
      return res.json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  }
}