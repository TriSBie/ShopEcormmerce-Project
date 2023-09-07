'use strict'

const express = require("express")
const router = express.Router()
const accessController = require("../../controllers/access.controllers")
const { asyncHandler } = require("../../helpers/asyncHandler")
//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

//authentication - check accessToken is legitable or not - prevent a sabotage
router.post('/shop/logout', asyncHandler(accessController.logout))

module.exports = router