const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) {
    return res.status(401).send('无权操作...')
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = payload
    next()
  } catch(error) {
    res.status(400).send('无效token...')
  }
}

module.exports = auth
