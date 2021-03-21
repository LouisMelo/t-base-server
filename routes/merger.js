const { Merger } = require('../models/merger')
const { Transaction } = require('../models/transaction')
const auth = require('../middleware/auth')
const groupBy = require('lodash/groupBy')
const round = require('lodash/round')

const express = require('express')
const router = express.Router()

router.post('/', auth, async (req, res) => {
  const { transactionIds } = req.body

  if (!transactionIds || transactionIds.length === 0) {
    return res.status(400).send('无法结算，请选择交易记录...')
  }

  const transactions = await Transaction.find({ _id: { $in: transactionIds }})

  const { b: buyGroup, s: sellGroup } = groupBy(transactions, (t) => t.type)

  const buySum = buyGroup.reduce((sum, curr) => {
    return sum + curr.price * curr.amount
  }, 0)

  const sellSum = sellGroup.reduce((sum, curr) => {
    return sum + curr.price * curr.amount
  }, 0)

  const fee = (sellSum + buySum) * 2 / 10000 + sellSum / 1000
  const profit = round(sellSum - buySum - fee, 2)

  let merger = Merger({
    uid: req.user._id,
    profit,
    transactionIds,
    date: new Date()
  })

  try {
    merger = await merger.save()

    await Transaction.updateMany({ _id: { $in: transactionIds }}, { isComplete: true })

    res.send(merger)
  } catch (error) {
    res.status(500).send('结算失败...')
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const mergers = await Merger.find({
      uid: req.user._id
    }).sort({ date: -1 })
    res.send(mergers)
  } catch(error) {
    res.status(500).send('Error: ' + error.message)
  }
})

module.exports = router
