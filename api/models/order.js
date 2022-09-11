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
})

module.exports = mongoose.model('Order', orderSchema)