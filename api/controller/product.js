const { Product } = require('../models')

modules.exports = {
  async create(req, res, next) {
    try {
      let { name, price, quantity } = req.body
      if (!name || !price || !quantity) return res.status(400).json({ status: 'error', message: 'Missing name / price / quantity.' })
      let { id } = await Product.create({ name, price, quantity }).lean()
      return res.json({ status: 'success', result: { id } })
    } catch (err) {
      next(err)
    }
  },
  async delete(req, res, next) {
    try {
      let id = req.params.id
      if (!id) return res.status(400).json({ status: 'error', message: 'Missing product id.' })

      let product = await Product.findById(id)
      if (product) return res.status(400).json({ status: 'error', message: 'Product not found' })
      await Product.deleteOne({ _id: id })
      return res.json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  }
}