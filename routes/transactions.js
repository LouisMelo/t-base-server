const { Transaction } = require('../models/transaction')
const auth = require('../middleware/auth')
const express = require('express')
const Joi = require('joi')

const router = express.Router()

// 获取用户的 transaction
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      uid: req.user._id,
      isComplete: false
    }).sort({ date: -1 })
    res.send(transactions)
  } catch (error) {
    res.status(500).send('Error: ' + error.message)
  }
})

// 创建
router.post('/', auth, async (req, res) => {
  const schema = Joi.object({
    type: Joi.string().valid('b', 's').required(),
    price: Joi.number().min(0).required(),
    amount: Joi.number().min(0).required(),
    code: Joi.string().max(6).required()
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const { type, price, amount, date, code, note } = req.body

  let transaction = new Transaction({
    uid: req.user._id,
    type,
    price,
    amount,
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

router.delete('/:id', auth, async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)

  if (!transaction) {
    return res.status(400).send('未找到对应交易记录...')
  }

  if (transaction.uid !== req.user._id) {
    return res.status(401).send('无权限删除此条记录...')
  }

  const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id)

  res.send(deletedTransaction)
})

module.exports = router
