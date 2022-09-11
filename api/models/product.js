const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

productSchema.virtual('orders', {
  ref: 'OrderItem',
  localField: '_id',
  foreignField: 'product'
})

module.exports = mongoose.model('Product', productSchema)