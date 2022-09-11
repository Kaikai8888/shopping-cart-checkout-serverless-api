const { Product } = require('../models')

module.exports = {
  async create(req, res, next) {
    try {
      let { name, price, quantity } = req.body
      if (!name || !price || !quantity) return res.status(400).json({ status: 'error', message: 'Missing name / price / quantity.' })
      let { _id: id } = await Product.create({ name, price, quantity })
      return res.json({ status: 'success', result: { id } })
    } catch (err) {
      next(err)
    }
  },
  async delete(req, res, next) {
    try {
      let id = req.params.id
      if (!id) return res.status(400).json({ status: 'error', message: 'Missing product id.' })
      let product = await Product.findById(id).populate('orders').lean()
      if (!product) return res.status(400).json({ status: 'error', message: 'Product not found' })
      if (product.orders && product.orders.length) return res.status(400).json({ status: 'error', message: 'Cannot delete product that has been ordered' })
      await Product.deleteOne({ _id: id })
      return res.json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  }
}