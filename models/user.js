const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 30 },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200
  },
  password: { type: String, required: true, minlength: 3, maxlength: 1024 },
})

const User = mongoose.model("User", userSchema)

exports.User = User
