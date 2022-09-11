const mongoose = require('mongoose')
const { Schema } = mongoose

const orderSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
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

orderSchema.virtual('items', {
  ref: 'OrderItem',
  localField: '_id',
  foreignField: 'order'
})

module.exports = mongoose.model('Order', orderSchema)