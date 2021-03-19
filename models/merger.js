const mongoose = require('mongoose')

/**
 * transaction-ids
 * profit
 * duration 按天
 */
const mergerSchema = new mongoose.Schema({
  uid: String,
  profit: { type: Number, required: true },
  transactionIds: [mongoose.Schema.Types.ObjectId],
  duration: Number,
  date: { type: Date, default: new Date() }
})

const Merger = mongoose.model('Merger', mergerSchema);

exports.Merger = Merger
