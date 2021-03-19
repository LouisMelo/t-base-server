const express = require('express')
const Joi = require('joi')
const { User } = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/', async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  })

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  let user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(400).send("Invalid email or password...")
  }
  console.log(user.password)

  const valid = await bcrypt.compare(req.body.password, user.password)
  if (!valid) {
    return res.status(400).send("Invalid email or password...")
  }

  const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET_KEY)

  res.send(token)
})

module.exports = router
