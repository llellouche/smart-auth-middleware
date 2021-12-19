
const express = require('express')
const userAuthController = require('./Controller/userAuthController')
const router = express.Router()

router.post('/auth', userAuthController.userAuth)
router.post('/register', userAuthController.userRegister)

module.exports = router
