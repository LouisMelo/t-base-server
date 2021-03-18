const mongoose = require('mongoose')

/**
 * transaction-ids
 * profit
 * duration 按天
 */
const mergerSchema = new mongoose.Schema({
  profit: { type: Number, required: true },
  transactionIds: [mongoose.Schema.Types.ObjectId],
  duration: Number
})

const Merger = mongoose.model('Merger', mergerSchema);

exports.Merger = Merger
