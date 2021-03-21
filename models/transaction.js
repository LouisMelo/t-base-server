const mongoose = require('mongoose')

/**
 * type
 * price
 * amount
 * uid
 * date
 * code
 * note
 * isComplete
 * mergerId
 */
const transactionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: Number,
  amount: Number,
  uid: String,
  date: Date,
  code: String,
  note: String,
  isComplete: { type: Boolean, default: false },
  mergerId: String
})

const Transaction = mongoose.model('Transaction', transactionSchema)

exports.Transaction = Transaction
