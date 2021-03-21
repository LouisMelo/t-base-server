const express = require('express')
const { User } = require('../models/user')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/', async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(200).required()
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  try {
    let user = await User.findOne({ email: req.body.email })

    if (user) {
      return res.status(400).send('用户已存在...')
    }

    const { name, email, password } = req.body

    user = new User({
      name,
      email,
      password
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, jwtSecretKey)

    res.send(token);

  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router
