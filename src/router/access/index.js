'use strict'

const express = require("express")
const router = express.Router()
const accessController = require("../../controllers/access.controllers")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")
//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

//authentication - check accessToken is legitable or not - prevent a sabotage
router.use(authentication)
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router