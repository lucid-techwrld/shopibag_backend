const express = require('express')
const router = express.Router()
const {login, createAccount} = require('../controller/userAuthController')

router.post('/login', login)
router.post('/create-account', createAccount)

module.exports = router