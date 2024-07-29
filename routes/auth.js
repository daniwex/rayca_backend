const express = require('express');

const loginAuthRouter = express.Router()
const {login, register} = require('../controllers/login')


loginAuthRouter.post('/register', register)
loginAuthRouter.post('/login', login)

module.exports = loginAuthRouter