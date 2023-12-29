'use strict'


const express = require("express")
const router = express.Router()

const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const checkoutController = require("../../controllers/checkout.controller")

router.use(authenticationV2)
router.post("/review", asyncHandler(checkoutController.checkout));

module.exports = router