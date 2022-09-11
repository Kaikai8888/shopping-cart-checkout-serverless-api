const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    match: [/@/, 'Invalid Email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
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

module.exports = mongoose.model('User', userSchema)