const { Transaction } = require('../models/transaction')
const express = require('express')
const Joi = require('joi')

const router = express.Router()

// 获取用户的 transaction
router.get('/', async (req, res) => {
  const { uid } = req.body

  try {
    const transactions = await Transaction.find({ uid, isComplete: false }).sort({ date: -1 })
    res.send(transactions)
  } catch (error) {
    res.status(500).send('Error: ' + error.message)
  }
})

router.post('/', async (req, res) => {
  const schema = Joi.object({
    type: Joi.string().valid('b', 's').required(),
    price: Joi.number().min(0).required(),
    amount: Joi.number().min(0).required(),
    uid: Joi.string().required(),
    code: Joi.string().max(6).required()
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

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
