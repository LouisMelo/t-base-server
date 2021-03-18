const { Transaction } = require('../models/transaction')
const express = require('express')

const router = express.Router()

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
router.post('/', async (req, res) => {
  const { type, price, amount, uid, date, code, note } = req.body

  let transaction = new Transaction({
    type,
    price,
    amount,
    uid,
    date,
    code,
    note
  })

  try {
    transaction = await transaction.save()
    res.send(transaction)
  } catch(error) {
    res.status(500).send(error.message)
    console.log(error.message)
  }
})

module.exports = router
