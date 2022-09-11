const { Order, OrderItem, User, Product } = require('../models')
const _ = require('lodash')
const db = require('../config/mongoose')
const product = require('../models/product')

module.exports = {
  async create(req, res, next) {
    try {
      let { user_id: userID, items } = req.body
      if (!userID || !items || !items.length) return res.status(400).json({ status: 'error', message: 'Missing user id / items.' })
      if (items.find(({ id, quantity }) => !id || !quantity )) return res.status(400).json({ status: 'error', message: 'Missing item id / quantity'})
      let user = await User.findById(userID)
      if (!user) return res.status(400).json({ status: 'error', message: 'User not found' })

      let groupedItems = _.groupBy(items, 'id')
      let uniqueItemIDs = Object.keys(groupedItems)

      const session = await db.startSession()
      session.startTransaction()
      try {
        let products = await Product.find({ _id: uniqueItemIDs }).session(session)
        if (uniqueItemIDs.length > products.length) {
          await session.abortTransaction()
          session.endSession()
          return res.status(400).json({ status: 'error', message: 'Some products not found' })
        }

        // check stock
        let groupedProducts = _.groupBy(products, (e) => e._id.toString())
        let orderItems = []
        for (let [id, _items] of Object.entries(groupedItems)) {
          let product = groupedProducts[id] && groupedProducts[id][0]
          if (!product) return res.status(400).json({ status: 'error', message: 'Product not found: ' + id }) 
          let totalQuantity = _.sumBy(_items, 'quantity')
          if (totalQuantity > product.quantity) {
            await session.abortTransaction()
            session.endSession()
            console.log(`Item out of stock, id: ${id}, quantity: ${product.quantity}, ordered quantity: ${totalQuantity}`)
            return res.status(400).json({ status: 'error', message: 'Item out of stock, id: ' + id })
          }

          orderItems.push({ product: id, quantity: totalQuantity, price: product.price })
          product.quantity -= totalQuantity
          await product.save()
        }
        
        const orders = await Order.create([{ user: userID }], { session })
        const orderID = orders[0]._id
        orderItems.forEach(e => e.order = orderID)
        await OrderItem.create(orderItems, { session })

        await session.commitTransaction();
        session.endSession();
        return res.json({ status: 'success', result: { id: orderID } })

      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err)
      }
    } catch (err) {
      next(err)
    }
  },
  async get(req, res, next) {
    try {
      let orders = await Order.find({}, '_id user items created_at updated_at').populate([
        { path: 'items', select: ['order', 'product', 'price', 'quantity'], populate: { path: 'product', select: 'name' }}, 
        { path: 'user', select: ['name', 'email']}
      ]).lean()
      return res.status(400).json({ status: 'success', result: orders })
    } catch (err) {
      next(err)
    }
  }
}