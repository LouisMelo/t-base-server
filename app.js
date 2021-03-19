const express = require('express')
const transactions = require('./routes/transactions')
const signUp = require('./routes/signUp')
const signIn = require('./routes/signIn')
const merger = require('./routes/merger')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

require('dotenv').config()

app.use(cors())
app.use(express.json())

app.use('/api/transactions', transactions)
app.use('/api/signup', signUp)
app.use('/api/signin', signIn)
app.use('/api/merger', merger)

app.get('/', (req, res) => {
  res.send('Welcome to apis')
})

const conn_str = process.env.CONNECTION_STR
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log('Server running on port:5000...')
})

mongoose.connect(conn_str, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected...'))
