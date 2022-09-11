const { Order, OrderItem, User, Product } = require('../models')
const _ = require('lodash')
const db = require('../config/mongoose')
const product = require('../models/product')

modules.exports = {
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
        let products = await Product.find({ id: { $in: uniqueItemIDs } }).session(session)
        if (uniqueItemIDs.length < products.length) {
          await session.abortTransaction()
          session.endSession()
          return res.status(400).json({ status: 'error', message: 'Some products not found' })
        }

        console.log(products[0].id, products[0])

        // check stock
        let groupedProducts = _(products).groupBy('_id')
        let orderItems = []
        for (let _items of groupedItems) {
          let id = _items[0]._id
          let product = groupedProducts[id][0]
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
        
        const order = await Order.create([{ user: userID }], { session }).lean()
        orderItems.forEach(e => e.order = order.id)
        await OrderItem.create(orderItems, { session })

        await session.commitTransaction();
        session.endSession();
        return res.json({ status: 'success', result: { id: order.id } })

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
      let orders = await Order.find().lean();
      return res.status(400).json({ status: 'success', result: orders })
    } catch (err) {
      next(err)
    }
  }
}